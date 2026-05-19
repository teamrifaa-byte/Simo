import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { articleAPI, catalogueAPI } from '../../services/api';

const empty = {
  titre: '', auteur: '', description: '', prix: 0, stock: 0, stockMin: 5,
  imageUrl: '', anneeSortie: null, editeur: '',
  categorie: null, genre: null, actif: true,
};

export default function ArticlesManagement() {
  const [articles, setArticles]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres]         = useState([]);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(empty);

  const load = () => articleAPI.list({}).then(({ data }) => setArticles(data));

  useEffect(() => {
    load();
    catalogueAPI.categories().then(({ data }) => setCategories(data));
    catalogueAPI.genres().then(({ data }) => setGenres(data));
  }, []);

  const openCreate = () => { setEditing('new'); setForm(empty); };
  const openEdit   = (a) => {
    setEditing(a.id);
    setForm({
      titre: a.titre, auteur: a.auteur, description: a.description,
      prix: a.prix, stock: a.stock, stockMin: a.stockMin,
      imageUrl: a.imageUrl, anneeSortie: a.anneeSortie, editeur: a.editeur,
      categorie: a.categorie, genre: a.genre, actif: a.actif,
    });
  };

  const save = async () => {
    if (!form.titre?.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }
    if (!form.categorie?.id) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }
    if (Number.isNaN(Number(form.prix)) || Number(form.prix) < 0) {
      toast.error('Veuillez saisir un prix valide');
      return;
    }

    const payload = {
      ...form,
      prix: Number(form.prix),
      stock: Number(form.stock || 0),
      stockMin: Number(form.stockMin || 5),
      anneeSortie: form.anneeSortie ? Number(form.anneeSortie) : null,
      categorie: { id: Number(form.categorie.id) },
      genre: form.genre?.id ? { id: Number(form.genre.id) } : null,
    };

    try {
      if (editing === 'new') await articleAPI.create(payload);
      else                   await articleAPI.update(editing, payload);
      toast.success('Article enregistré');
      setEditing(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const remove = async (id) => {
    if (!confirm('Désactiver cet article ?')) return;
    await articleAPI.delete(id);
    toast.success('Article supprimé'); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl text-navy">Gestion des articles</h1>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} className="mr-1"/> Nouvel article</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3 text-right">Prix</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">{a.titre}</p>
                  <p className="text-xs text-gray-500">{a.auteur}</p>
                </td>
                <td className="px-4 py-3">{a.categorie?.libelle}</td>
                <td className="px-4 py-3 text-right">{Number(a.prix).toFixed(2)} MAD</td>
                <td className="px-4 py-3 text-right">
                  <span className={a.enRupture ? 'badge bg-red-100 text-red-700' : ''}>{a.stock}</span>
                </td>
                <td className="px-4 py-3">{a.actif ? 'Actif' : 'Désactivé'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(a)} className="text-navy hover:text-gold"><Edit2 size={16}/></button>
                  <button onClick={() => remove(a.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-navy">{editing === 'new' ? 'Nouvel article' : 'Modifier article'}</h2>
              <button onClick={() => setEditing(null)}><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="input col-span-2" placeholder="Titre" value={form.titre} onChange={(e) => setForm({...form, titre: e.target.value})}/>
              <input className="input" placeholder="Auteur/Artiste" value={form.auteur || ''} onChange={(e) => setForm({...form, auteur: e.target.value})}/>
              <input className="input" placeholder="Éditeur" value={form.editeur || ''} onChange={(e) => setForm({...form, editeur: e.target.value})}/>
              <input className="input" type="number" placeholder="Prix (MAD)" value={form.prix} onChange={(e) => setForm({...form, prix: e.target.value})}/>
              <input className="input" type="number" placeholder="Année" value={form.anneeSortie || ''} onChange={(e) => setForm({...form, anneeSortie: parseInt(e.target.value) || null})}/>
              <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}/>
              <input className="input" type="number" placeholder="Stock minimum" value={form.stockMin} onChange={(e) => setForm({...form, stockMin: e.target.value})}/>
              <select className="input" value={form.categorie?.id || ''} onChange={(e) => setForm({...form, categorie: categories.find(c => c.id === Number(e.target.value)), genre: null})}>
                <option value="">— Catégorie —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.libelle}</option>)}
              </select>
              <select className="input" value={form.genre?.id || ''} onChange={(e) => setForm({...form, genre: genres.find(g => g.id === Number(e.target.value))})}>
                <option value="">— Genre —</option>
                {genres.filter((g) => !form.categorie || g.categorie?.id === form.categorie?.id).map((g) =>
                  <option key={g.id} value={g.id}>{g.libelle}</option>
                )}
              </select>
              <input className="input col-span-2" placeholder="URL image" value={form.imageUrl || ''} onChange={(e) => setForm({...form, imageUrl: e.target.value})}/>
              <textarea className="input col-span-2" rows={3} placeholder="Description" value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})}/>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="btn-outline">Annuler</button>
              <button onClick={save} className="btn-primary">Enregistrer</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
