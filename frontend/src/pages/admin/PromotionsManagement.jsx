import { useEffect, useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { promotionAPI, articleAPI } from '../../services/api';

export default function PromotionsManagement() {
  const [promos, setPromos]       = useState([]);
  const [articles, setArticles]   = useState([]);
  const [form, setForm]           = useState({ articleId: '', pourcentage: 10, dateDebut: '', dateFin: '', libelle: '' });

  const load = () => promotionAPI.all().then(({ data }) => setPromos(data));

  useEffect(() => {
    load();
    articleAPI.list({}).then(({ data }) => setArticles(data));
  }, []);

  const add = async () => {
    if (!form.articleId || !form.dateDebut || !form.dateFin) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    try {
      await promotionAPI.create({
        article: { id: Number(form.articleId) },
        pourcentage: Number(form.pourcentage),
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        libelle: form.libelle,
      });
      toast.success('Promotion créée');
      setForm({ articleId: '', pourcentage: 10, dateDebut: '', dateFin: '', libelle: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const del = async (id) => {
    if (!confirm('Supprimer cette promotion ?')) return;
    await promotionAPI.delete(id);
    toast.success('Promotion supprimée'); load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy mb-8">Promotions hebdomadaires</h1>

      <div className="grid lg:grid-cols-[1fr,2fr] gap-6">
        {/* Form */}
        <div className="card p-6">
          <h2 className="font-serif text-xl text-navy mb-4">Nouvelle promotion</h2>
          <div className="space-y-3">
            <select className="input" value={form.articleId}
                    onChange={(e) => setForm({...form, articleId: e.target.value})}>
              <option value="">— Article —</option>
              {articles.map((a) => <option key={a.id} value={a.id}>{a.titre}</option>)}
            </select>
            <input type="number" className="input" min={1} max={90} placeholder="Pourcentage"
                   value={form.pourcentage}
                   onChange={(e) => setForm({...form, pourcentage: e.target.value})}/>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input" value={form.dateDebut}
                     onChange={(e) => setForm({...form, dateDebut: e.target.value})}/>
              <input type="date" className="input" value={form.dateFin}
                     onChange={(e) => setForm({...form, dateFin: e.target.value})}/>
            </div>
            <input className="input" placeholder="Libellé (ex: Promo SF)" value={form.libelle}
                   onChange={(e) => setForm({...form, libelle: e.target.value})}/>
            <button onClick={add} className="btn-primary w-full"><Plus size={16} className="mr-1"/> Créer</button>
          </div>
        </div>

        {/* Liste */}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3 text-center">%</th>
                <th className="px-4 py-3">Période</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-navy">{p.article?.titre}</td>
                  <td className="px-4 py-3 text-gray-600">{p.libelle}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge bg-gold/20 text-navy"><Tag size={10} className="inline mr-1"/>-{p.pourcentage}%</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(p.dateDebut).toLocaleDateString('fr-FR')}<br/>
                    → {new Date(p.dateFin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => del(p.id)} className="text-red-500"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
