import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl font-semibold">404 — Page introuvable</h1>
      <p className="text-slate-600 mt-2">La page que vous cherchez n'existe pas.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Retour à l'accueil</Link>
    </div>
  );
}


