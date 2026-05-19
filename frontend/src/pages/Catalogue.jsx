import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { articleAPI, catalogueAPI } from '../services/api';

export default function Catalogue() {
  const [params, setParams] = useSearchParams();
  const [articles, setArticles]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [q, setQ]                 = useState(params.get('q') || '');

  const categorieId = params.get('categorieId') || '';
  const genreId     = params.get('genreId') || '';

  useEffect(() => {
    catalogueAPI.categories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (categorieId) catalogueAPI.genres(categorieId).then(({ data }) => setGenres(data));
    else setGenres([]);
  }, [categorieId]);

  useEffect(() => {
    setLoading(true);
    articleAPI.list({
      categorieId: categorieId || undefined,
      genreId:     genreId || undefined,
      q:           q || undefined,
    })
      .then(({ data }) => setArticles(data))
      .finally(() => setLoading(false));
  }, [categorieId, genreId, q]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key === 'categorieId') next.delete('genreId');
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="font-serif text-4xl text-navy mb-2">Catalogue</motion.h1>
      <p className="text-gray-500 mb-8">Explorez notre sélection complète</p>

      {/* Recherche */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Rechercher un titre, un auteur, un artiste…"
          value={q} onChange={(e) => setQ(e.target.value)}
          className="input pl-10" />
      </div>

      <div className="grid lg:grid-cols-[240px,1fr] gap-8">
        {/* Filtres */}
        <aside className="space-y-6">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-navy mb-3">
              <Filter size={16}/> Catégorie
            </h3>
            <div className="space-y-2">
              <button onClick={() => updateFilter('categorieId', '')}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${!categorieId ? 'bg-navy text-white' : 'hover:bg-gray-100'}`}>
                Toutes
              </button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => updateFilter('categorieId', c.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg ${String(categorieId) === String(c.id) ? 'bg-navy text-white' : 'hover:bg-gray-100'}`}>
                  {c.libelle}
                </button>
              ))}
            </div>
          </div>
          {genres.length > 0 && (
            <div>
              <h3 className="font-semibold text-navy mb-3">Genre</h3>
              <div className="space-y-2">
                <button onClick={() => updateFilter('genreId', '')}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${!genreId ? 'bg-gold text-navy' : 'hover:bg-gray-100'}`}>
                  Tous les genres
                </button>
                {genres.map((g) => (
                  <button key={g.id} onClick={() => updateFilter('genreId', g.id)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${String(genreId) === String(g.id) ? 'bg-gold text-navy' : 'hover:bg-gray-100'}`}>
                    {g.libelle}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Liste */}
        <div>
          {loading ? (
            <p className="text-gray-500">Chargement…</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-500">Aucun article trouvé.</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{articles.length} article(s)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {articles.map((a, i) => <ProductCard key={a.id} article={a} index={i} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
