import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, AlertTriangle, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.dashboard().then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p>Chargement…</p>;

  const kpis = [
    { label: 'Articles',        value: stats.nbArticles,  Icon: Package,       color: 'bg-blue-500' },
    { label: 'Commandes',       value: stats.nbCommandes, Icon: ShoppingCart,  color: 'bg-green-500' },
    { label: 'En rupture',      value: stats.nbRuptures,  Icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Réappro en cours', value: stats.nbReappros, Icon: RefreshCw,     color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy mb-2">Tableau de bord</h1>
      <p className="text-gray-500 mb-8">Vue d'ensemble de l'activité MARINFO</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card p-6">
            <div className={`w-12 h-12 rounded-lg ${k.color} flex items-center justify-center text-white mb-4`}>
              <k.Icon size={24}/>
            </div>
            <p className="text-3xl font-bold text-navy">{k.value}</p>
            <p className="text-sm text-gray-500">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Articles en rupture */}
      {stats.articlesEnRupture?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-6">
          <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500"/> Articles en rupture
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Titre</th>
                <th className="pb-2">Auteur</th>
                <th className="pb-2 text-right">Stock</th>
                <th className="pb-2 text-right">Seuil min</th>
              </tr>
            </thead>
            <tbody>
              {stats.articlesEnRupture.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0">
                  <td className="py-3 font-medium text-navy">{a.titre}</td>
                  <td className="py-3 text-gray-600">{a.auteur}</td>
                  <td className="py-3 text-right">
                    <span className="badge bg-red-100 text-red-700">{a.stock}</span>
                  </td>
                  <td className="py-3 text-right text-gray-500">{a.stockMin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
