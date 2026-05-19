import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300" />
        <h1 className="font-serif text-3xl text-navy mt-4">Votre panier est vide</h1>
        <p className="text-gray-500 mt-2">Découvrez notre catalogue et ajoutez vos articles préférés.</p>
        <Link to="/catalogue" className="btn-primary mt-6">Voir le catalogue</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl text-navy mb-8">Mon panier ({count})</h1>
      <div className="grid lg:grid-cols-[1fr,360px] gap-8">
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="card p-4 flex gap-4">
                <img src={item.imageUrl} alt={item.titre} className="w-20 h-28 object-cover rounded-lg"
                     onError={(e) => { e.target.src = `https://placehold.co/80x112/1E2761/E8C547?text=${item.titre[0]}`; }} />
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-navy">{item.titre}</h3>
                  <p className="text-navy font-bold mt-1">{Number(item.prix).toFixed(2)} MAD</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.quantite - 1)} className="px-2 py-1 hover:bg-gray-100"><Minus size={14}/></button>
                      <span className="px-3 text-sm font-bold">{item.quantite}</span>
                      <button onClick={() => updateQty(item.id, item.quantite + 1)} className="px-2 py-1 hover:bg-gray-100"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700" title="Supprimer">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-navy">{(Number(item.prix) * item.quantite).toFixed(2)} MAD</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Récap */}
        <aside className="card p-6 h-fit sticky top-20">
          <h2 className="font-serif text-xl text-navy mb-4">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Sous-total</span><span>{total.toFixed(2)} MAD</span></div>
            <div className="flex justify-between"><span>Livraison</span><span className="text-green-600">Gratuite</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold text-navy">
              <span>Total</span><span>{total.toFixed(2)} MAD</span>
            </div>
          </div>
          <button onClick={() => nav(user ? '/checkout' : '/login?next=/checkout')}
                  className="btn-primary w-full mt-6">
            {user ? 'Valider la commande' : 'Se connecter pour commander'} <ArrowRight size={18} className="ml-2"/>
          </button>
          <Link to="/catalogue" className="block text-center text-sm text-navy hover:text-gold mt-3">Continuer mes achats</Link>
        </aside>
      </div>
    </div>
  );
}
