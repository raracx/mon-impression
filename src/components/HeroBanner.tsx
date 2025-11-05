"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute -top-24 -left-24 h-96 w-96 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-blue-400/20 blur-3xl rounded-full" />

      <div className="container-page relative py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center text-white">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-semibold leading-tight"
          >
            Personnalisez vos t‑shirts, hoodies et tasses en quelques minutes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-4 text-slate-200 max-w-xl"
          >
            Téléversez votre image, ajoutez du texte, prévisualisez en direct et
            commandez. Production rapide, qualité professionnelle, service
            local.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link
              href="/product/tshirt/personnaliser"
              className="btn-primary bg-white text-slate-900 hover:bg-slate-200"
            >
              Personnaliser maintenant
            </Link>
            <Link
              href="#produits-populaires"
              className="btn-primary bg-transparent ring-1 ring-white/40 hover:bg-white/10"
            >
              Voir les produits
            </Link>
          </motion.div>
          <div className="mt-6 flex items-center gap-3 opacity-80">
            <img
              src="/assets/proudly-canadian.svg"
              alt="Fièrement canadien"
              className="h-8"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="relative grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-2 card bg-white/10 backdrop-blur border border-white/10 p-4"
            >
              <Image
                src="https://boutiqueethica.com/wp-content/uploads/2023/03/hooded-sweater-unisex-chandail-capuchon-unisexe-black-noir-attraction-ethica-515-v2-900x1050.jpg"
                alt="Chandail à capuchon unisexe"
                width={800}
                height={600}
                className="rounded-md object-cover w-full h-48"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-white/10 backdrop-blur border border-white/10 p-4"
            >
              <Image
                src="https://alternaeco.com/wp-content/uploads/2015/08/301-0502_crewneck-sweater-chandail-col-rond-unisex-unisex-black-noir-ethica-.jpg"
                alt="Chandail à col rond unisexe"
                width={400}
                height={400}
                className="rounded-md object-cover w-full h-48"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-white/10 backdrop-blur border border-white/10 p-4"
            >
              <Image
                src="https://www.roots.com/dw/image/v2/BGGS_PRD/on/demandware.static/-/Sites-roots_master_catalog/default/dw1024414a/images/29030583_001_a.jpg?sw=1200&sh=1200&sm=fit"
                alt="Chandail à capuche pour enfant"
                width={400}
                height={400}
                className="rounded-md object-cover w-full h-48"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-2 card bg-white/10 backdrop-blur border border-white/10 p-4"
            >
              <Image
                src="https://m.media-amazon.com/images/I/61x-NMTPmiL._UY1000_.jpg"
                alt="Chandail à col rond pour enfant"
                width={800}
                height={600}
                className="rounded-md object-cover w-full h-48"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
