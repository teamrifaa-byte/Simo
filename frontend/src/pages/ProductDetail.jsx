import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Calendar, Building, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { articleAPI } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addItem } = useCart();
  const [article, setArticle] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    articleAPI.get(id).then(({ data }) => setArticle(data));
  }, [id]);

  if (!article) return <div className="p-8 text-center text-navy">Chargement…</div>;

  const enPromo = !!article.promotion;
  const prixAffiche = enPromo ? article.prixFinal : article.prix;

  const handleAdd = () => {
    if (article.stock < qty) { toast.error('Stock insuffisant'); return; }
    addItem(article, qty);
    toast.success(`${qty} × ${article.titre} ajouté(s) au panier`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-navy hover:text-gold mb-6">
        <ArrowLeft size={18}/> Retour
      </button>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}
          className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/4]">
          <img src={article.imageUrl} alt={article.titre}
               className="w-full h-full object-cover"
               onError={(e) => { e.target.src = `https://placehold.co/600x800/1E2761/E8C547?text=${encodeURIComponent(article.titre)}`; }} />
        </motion.div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gold font-bold">{article.categorie?.libelle}</p>
          <h1 className="font-serif text-4xl text-navy mt-2">{article.titre}</h1>
          <p className="text-lg text-gray-600 mt-1">{article.auteur}</p>

          <div className="mt-6">
            {enPromo ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl text-navy font-bold">{Number(prixAffiche).toFixed(2)} MAD</span>
                <span className="text-gray-400 line-through">{Number(article.prix).toFixed(2)}</span>
                <span className="badge bg-gold text-navy flex items-center gap-1">
                  <Tag size={12}/> -{article.promotion.pourcentage}%
                </span>
              </div>
            ) : (
              <span className="text-3xl text-navy font-bold">{Number(article.prix).toFixed(2)} MAD</span>
            )}
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-700">
            {article.anneeSortie && <p className="flex items-center gap-2"><Calendar size={14}/> Sortie : {article.anneeSortie}</p>}
            {article.editeur && <p className="flex items-center gap-2"><Building size={14}/> Éditeur : {article.editeur}</p>}
            {article.genre && <p>Genre : <span className="font-medium">{article.genre.libelle}</span></p>}
            <p className={article.stock > 5 ? 'text-green-600' : article.stock > 0 ? 'text-orange-600' : 'text-red-600'}>
              {article.stock > 5 ? 'En stock' : article.stock > 0 ? `Plus que ${article.stock} en stock` : 'Rupture de stock'}
            </p>
          </div>

          {article.description && (
            <p className="mt-6 text-gray-700 leading-relaxed">{article.description}</p>
          )}

          {article.stock > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border-2 border-navy rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-navy hover:text-white">-</button>
                <span className="px-4 font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(article.stock, qty + 1))} className="px-3 py-2 hover:bg-navy hover:text-white">+</button>
              </div>
              <button onClick={handleAdd} className="btn-primary">
                <ShoppingCart size={18} className="mr-2"/> Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
