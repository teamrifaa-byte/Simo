import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { commandeAPI } from '../../services/api';

const ETAT_STYLES = {
  EN_ATTENTE:  'bg-yellow-100 text-yellow-700',
  CONFIRMEE:   'bg-blue-100 text-blue-700',
  EN_LIVRAISON:'bg-purple-100 text-purple-700',
  LIVREE:      'bg-green-100 text-green-700',
  ANNULEE:     'bg-red-100 text-red-700',
};

const ETATS = ['EN_ATTENTE', 'CONFIRMEE', 'EN_LIVRAISON', 'LIVREE', 'ANNULEE'];

export default function CommandesManagement() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await commandeAPI.all();
      setCommandes(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Erreur lors du chargement des commandes');
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changerEtat = async (id, etat) => {
    try {
      await commandeAPI.setEtat(id, etat);
      toast.success('État mis à jour');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  if (loading) return <p className="p-6">Chargement…</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl text-navy">Gestion des commandes</h1>
        <span className="text-sm text-gray-500">{commandes.length} commande(s)</span>
      </div>

      <div className="card overflow-hidden">
        {commandes.length === 0 ? (
          <p className="p-8 text-center text-gray-400">Aucune commande trouvée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Numéro</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">État</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{c.numero}</td>
                  <td className="px-4 py-3">
                    {c.clientNom || c.client?.nomComplet || c.client?.email || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {c.dateCommande
                      ? new Date(c.dateCommande).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {Number(c.montantTotal ?? c.total ?? 0).toFixed(2)} MAD
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${ETAT_STYLES[c.etat] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.etat}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    {/* Changer l'état */}
                    <select
                      value={c.etat}
                      onChange={(e) => changerEtat(c.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 bg-white"
                    >
                      {ETATS.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    {/* Voir le détail */}
                    <button
                      onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      className="text-navy hover:text-gold"
                      title="Détail"
                    >
                      <Eye size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Panneau détail */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 mt-4"
        >
          <h2 className="font-serif text-xl text-navy mb-4">
            Détail — commande {selected.numero}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Adresse : {selected.adresseLivraison}, {selected.villeLivraison}
          </p>
          {selected.lignes?.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2">Article</th>
                  <th className="px-3 py-2 text-right">Qté</th>
                  <th className="px-3 py-2 text-right">Prix unit.</th>
                  <th className="px-3 py-2 text-right">Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {selected.lignes.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="px-3 py-2">{l.article?.titre ?? l.articleTitre}</td>
                    <td className="px-3 py-2 text-right">{l.quantite}</td>
                    <td className="px-3 py-2 text-right">{Number(l.prixUnitaire).toFixed(2)} MAD</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {(l.quantite * l.prixUnitaire).toFixed(2)} MAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">Aucune ligne disponible.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}