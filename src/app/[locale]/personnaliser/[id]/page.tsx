"use client";
import { useEffect, useRef, useState } from 'react';
import CustomizerCanvas, { type CustomizerHandle } from '@/components/CustomizerCanvas';
import Toolbox from '@/components/Toolbox';
import StickersPanel from '@/components/StickersPanel';
import { useRouter, useSearchParams } from 'next/navigation';

const productImages: Record<string, string> = {
  tshirt: '/assets/tshirt.jpg',
  hoodie: '/assets/hoodie.jpeg',
  mug: '/assets/products/mug.svg',
  mask: '/assets/products/mask.svg',
  casquette: '/assets/casquetterrouge.jpg',
  'hoodie-noir': '/assets/hoodienoir.jpg',
};

export default function PersonnaliserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef<CustomizerHandle | null>(null);
  const productId = params.id;
  const [base, setBase] = useState<string>(productImages[productId] || '/assets/tshirt.jpg');

  useEffect(() => {
    const img = searchParams.get('img');
    if (img) {
      if (img.startsWith('http')) {
        setBase(`/api/img?url=${encodeURIComponent(img)}`);
      } else {
        setBase(img);
      }
    }
    else setBase(productImages[productId] || '/assets/tshirt.jpg');
  }, [searchParams, productId]);

  const order = async () => {
    if (!ref.current) return;
    setLoading(true);
    const dataUrl = ref.current.exportDesign();
    if (!dataUrl) { setLoading(false); return; }
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, email, design: dataUrl }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de la création de la commande');
      const { orderId } = json;
      const pay = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, productId }) });
      const payJson = await pay.json();
      if (!pay.ok) throw new Error(payJson.error || 'Erreur Stripe');
      setLoading(false);
      router.push(payJson.url);
    } catch (e: any) {
      setLoading(false);
      alert(e.message);
    }
  };

  const download = () => {
    const url = ref.current?.exportDesign();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-${productId}.png`;
    a.click();
  };

  return (
    <div className="container-page py-8 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
      <div className="space-y-4">
        <CustomizerCanvas ref={ref} baseImage={base} />
      </div>
      <div className="space-y-4">
        <div className="card p-5">
          <h1 className="text-xl font-semibold">Personnaliser — {productId}</h1>
          <p className="text-sm text-slate-600">Ajoutez du texte, importez une image, appliquez vos styles, puis commandez.</p>
        </div>
        <Toolbox
          onAddText={() => ref.current?.addText()}
          onUploadImage={(f) => ref.current?.addImage(f)}
          onColor={(c) => ref.current?.setColor(c)}
          onDelete={() => ref.current?.deleteSelected()}
          onFontFamily={(f)=>ref.current?.setFontFamily(f)}
          onFontSize={(s)=>ref.current?.setFontSize(s)}
          onBold={()=>ref.current?.toggleBold()}
          onItalic={()=>ref.current?.toggleItalic()}
          onAlign={(a)=>ref.current?.alignText(a)}
          onStroke={(c)=>ref.current?.setStroke(c)}
          onStrokeWidth={(w)=>ref.current?.setStrokeWidth(w)}
          onDuplicate={()=>ref.current?.duplicateSelected()}
          onForward={()=>ref.current?.bringForward()}
          onBackward={()=>ref.current?.sendBackward()}
          onToggleGrid={()=>ref.current?.toggleGrid()}
          onSetSide={(s)=>ref.current?.setSide(s)}
          onZoomIn={()=>ref.current?.zoomIn()}
          onZoomOut={()=>ref.current?.zoomOut()}
          onResetZoom={()=>ref.current?.resetZoom()}
          onExport={download}
        />
        <StickersPanel onPick={(url)=>ref.current?.addImageFromUrl(url)} />
        <div className="card p-5 space-y-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Votre email" className="border rounded-md px-3 py-2 w-full" />
          <button className="btn-primary w-full" disabled={!email || loading} onClick={order}>{loading ? 'Chargement…' : 'Commander maintenant'}</button>
          <p className="text-xs text-slate-500">Le paiement est traité par Stripe. Un aperçu de votre design sera envoyé avec la commande.</p>
        </div>
      </div>
    </div>
  );
}


