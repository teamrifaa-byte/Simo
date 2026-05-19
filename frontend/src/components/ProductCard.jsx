import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ article, index = 0 }) {
  const { addItem } = useCart();
  const enPromo = !!article.promotion;

  const handleAdd = (e) => {
    e.preventDefault();
    if (article.stock < 1) { toast.error('Article en rupture de stock'); return; }
    addItem(article);
    toast.success(`${article.titre} ajouté au panier`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="card group overflow-hidden">
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img src={article.imageUrl} alt={article.titre}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               onError={(e) => { e.target.src = `https://placehold.co/300x400/1E2761/E8C547?text=${encodeURIComponent(article.titre)}`; }} />
          {enPromo && (
            <span className="absolute top-2 left-2 badge bg-gold text-navy flex items-center gap-1">
              <Tag size={12} /> -{article.promotion.pourcentage}%
            </span>
          )}
          {article.stock < 5 && article.stock > 0 && (
            <span className="absolute top-2 right-2 badge bg-orange-500 text-white">Plus que {article.stock}</span>
          )}
          {article.stock === 0 && (
            <span className="absolute top-2 right-2 badge bg-red-500 text-white">Rupture</span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">{article.categorie?.libelle}</p>
          <h3 className="font-serif font-bold text-navy line-clamp-1 mt-1">{article.titre}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{article.auteur}</p>
          <div className="flex items-baseline justify-between mt-3">
            <div>
              {enPromo ? (
                <>
                  <span className="text-navy font-bold text-lg">{Number(article.prixFinal).toFixed(2)} MAD</span>
                  <span className="text-gray-400 line-through text-sm ml-2">{Number(article.prix).toFixed(2)}</span>
                </>
              ) : (
                <span className="text-navy font-bold text-lg">{Number(article.prix).toFixed(2)} MAD</span>
              )}
            </div>
            <button onClick={handleAdd}
                    className="bg-navy text-white p-2 rounded-lg hover:bg-gold hover:text-navy transition-colors"
                    title="Ajouter au panier">
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
