import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, ShoppingBag } from 'lucide-react';
import { commandeAPI } from '../services/api';

const ETAT_STYLES = {
  EN_ATTENTE:       'bg-gray-100 text-gray-700',
  VALIDEE:          'bg-blue-100 text-blue-700',
  EN_PREPARATION:   'bg-yellow-100 text-yellow-700',
  EXPEDIEE:         'bg-indigo-100 text-indigo-700',
  LIVREE:           'bg-green-100 text-green-700',
  LIVREE_PARTIELLE: 'bg-orange-100 text-orange-700',
  ANNULEE:          'bg-red-100 text-red-700',
};

export default function OrderHistory() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    commandeAPI.mine()
      .then(({ data }) => setCommandes(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-center">Chargement…</p>;

  if (commandes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300" />
        <h1 className="font-serif text-3xl text-navy mt-4">Aucune commande</h1>
        <p className="text-gray-500 mt-2">Vous n'avez pas encore passé de commande.</p>
        <Link to="/catalogue" className="btn-primary mt-6">Voir le catalogue</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl text-navy mb-8">Mes commandes</h1>
      <div className="space-y-4">
        {commandes.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-navy w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-navy">{c.numero}</p>
              <p className="text-sm text-gray-500">
                {new Date(c.dateCommande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' '}— {c.lignes?.length || 0} article(s)
              </p>
            </div>
            <span className={`badge ${ETAT_STYLES[c.etat] || 'bg-gray-100'}`}>
              {c.etat.replace(/_/g, ' ')}
            </span>
            <p className="font-bold text-navy">{Number(c.montantTotal).toFixed(2)} MAD</p>
            <Link to={`/commande/${c.id}`} className="text-navy hover:text-gold" title="Détails">
              <Eye size={20}/>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
