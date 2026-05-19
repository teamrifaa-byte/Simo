import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { catalogueAPI } from '../../services/api';

export default function CategoriesManagement() {
  const [cats, setCats]     = useState([]);
  const [genres, setGenres] = useState([]);
  const [newCat, setNewCat]     = useState({ libelle: '', description: '' });
  const [newGenre, setNewGenre] = useState({ libelle: '', categorieId: '' });

  const load = () => {
    catalogueAPI.categories().then(({ data }) => setCats(data));
    catalogueAPI.genres().then(({ data }) => setGenres(data));
  };
  useEffect(load, []);

  const addCat = async () => {
    if (!newCat.libelle) return;
    await catalogueAPI.createCat(newCat);
    setNewCat({ libelle: '', description: '' });
    toast.success('Catégorie ajoutée'); load();
  };
  const delCat = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await catalogueAPI.deleteCat(id); toast.success('Supprimée'); load();
  };
  const addGenre = async () => {
    if (!newGenre.libelle || !newGenre.categorieId) return;
    await catalogueAPI.createGenre({
      libelle: newGenre.libelle,
      categorie: { id: Number(newGenre.categorieId) }
    });
    setNewGenre({ libelle: '', categorieId: '' });
    toast.success('Genre ajouté'); load();
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy mb-8">Catégories & genres</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Catégories */}
        <div className="card p-6">
          <h2 className="font-serif text-xl text-navy mb-4">Catégories</h2>
          <div className="flex gap-2 mb-4">
            <input className="input flex-1" placeholder="Libellé" value={newCat.libelle}
                   onChange={(e) => setNewCat({...newCat, libelle: e.target.value})}/>
            <button onClick={addCat} className="btn-primary !py-2"><Plus size={16}/></button>
          </div>
          <ul className="space-y-2">
            {cats.map((c) => (
              <li key={c.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                <span className="font-medium text-navy">{c.libelle}</span>
                <button onClick={() => delCat(c.id)} className="text-red-500"><Trash2 size={14}/></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Genres */}
        <div className="card p-6">
          <h2 className="font-serif text-xl text-navy mb-4">Genres</h2>
          <div className="space-y-2 mb-4">
            <input className="input" placeholder="Libellé du genre" value={newGenre.libelle}
                   onChange={(e) => setNewGenre({...newGenre, libelle: e.target.value})}/>
            <div className="flex gap-2">
              <select className="input flex-1" value={newGenre.categorieId}
                      onChange={(e) => setNewGenre({...newGenre, categorieId: e.target.value})}>
                <option value="">— Catégorie —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.libelle}</option>)}
              </select>
              <button onClick={addGenre} className="btn-primary !py-2"><Plus size={16}/></button>
            </div>
          </div>
          <ul className="space-y-1 max-h-96 overflow-y-auto">
            {genres.map((g) => (
              <li key={g.id} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded text-sm">
                <span>{g.libelle} <span className="text-gray-400">— {g.categorie?.libelle}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
