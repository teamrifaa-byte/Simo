import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Disc, Film, Sparkles } from 'lucide-react';
import Hero3D from '../components/Hero3D';
import ProductCard from '../components/ProductCard';
import { articleAPI, promotionAPI } from '../services/api';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articleAPI.list({})
      .then(({ data }) => setArticles(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch((err) => {
        console.error('Erreur chargement articles:', err);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 1, label: 'Livres', Icon: BookOpen, desc: 'Romans, essais, polars',     color: 'from-blue-500/20 to-blue-700/20' },
    { id: 2, label: 'CD',     Icon: Disc,     desc: 'Jazz, rock, classique',     color: 'from-purple-500/20 to-purple-700/20' },
    { id: 3, label: 'DVD',    Icon: Film,     desc: 'Films, séries, animations', color: 'from-rose-500/20 to-rose-700/20' },
  ];

  return (
    <div>
      {/* ============= HERO ============= */}
      <section className="relative bg-gradient-to-br from-navy via-navy-soft to-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-ice rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full mb-6">
              <Sparkles size={14} className="text-gold" />
              <span className="text-white/90 text-xs tracking-widest font-medium">CULTURE EN LIGNE — MAROC</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight">
              Livres, musique<br />et films,<br />
              <span className="text-gold">à portée de clic.</span>
            </h1>
            <p className="text-ice mt-6 text-lg max-w-md">
              Découvrez notre catalogue soigneusement sélectionné et faites-vous livrer partout au Maroc.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/catalogue" className="btn-gold">Explorer le catalogue <ArrowRight size={18} className="ml-2"/></Link>
              <Link to="/catalogue?categorieId=2" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-navy">Voir les promos</Link>
            </div>
          </motion.div>

          {/* Hero 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[400px] lg:h-[500px]">
            <Suspense fallback={<div className="h-full flex items-center justify-center text-white/60">Chargement 3D…</div>}>
              <Hero3D />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ============= CATÉGORIES ============= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl text-navy text-center mb-12">Explorez par catégorie</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}>
              <Link to={`/catalogue?categorieId=${c.id}`}
                    className={`block bg-gradient-to-br ${c.color} bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all`}>
                <div className="bg-navy w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <c.Icon size={26} className="text-gold" />
                </div>
                <h3 className="font-serif text-2xl text-navy font-bold">{c.label}</h3>
                <p className="text-gray-600 mt-2">{c.desc}</p>
                <span className="inline-flex items-center gap-1 text-navy font-semibold mt-4">
                  Découvrir <ArrowRight size={16}/>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============= NOUVEAUTÉS ============= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-serif text-3xl text-navy">À découvrir</h2>
          <Link to="/catalogue" className="text-navy hover:text-gold font-medium flex items-center gap-1">
            Tout voir <ArrowRight size={16}/>
          </Link>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Chargement…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {articles.map((a, i) => <ProductCard key={a.id} article={a} index={i} />)}
          </div>
        )}
      </section>

      {/* ============= USP ============= */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { t: 'Livraison rapide',    d: '48h dans les grandes villes du Maroc' },
            { t: 'Paiement sécurisé',   d: 'Carte bancaire ou paiement à la livraison' },
            { t: 'Satisfait ou remboursé', d: 'Retours acceptés sous 14 jours' },
          ].map((u, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <h3 className="font-serif text-xl text-gold">{u.t}</h3>
              <p className="text-white/70 mt-2">{u.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
