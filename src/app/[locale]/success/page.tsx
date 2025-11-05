import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-semibold">Merci pour votre achat!</h1>
      <p className="text-slate-600 mt-2">Un email de confirmation vous a été envoyé. Nous traiterons votre commande rapidement.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Retour à l'accueil</Link>
    </div>
  );
}


