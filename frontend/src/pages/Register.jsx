import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    adresse: '',
    ville: ''
  });

  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);

      toast.success('Compte créé avec succès !');

      nav('/login');
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        'Erreur lors de l’inscription'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 to-ice/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 w-full max-w-lg"
      >
        <h1 className="font-serif text-3xl text-navy mb-2">
          Créer un compte
        </h1>

        <p className="text-gray-500 mb-6">
          Rejoignez la communauté MARINFO
        </p>

        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <input
            name="prenom"
            value={form.prenom}
            onChange={handle}
            required
            placeholder="Prénom *"
            className="input"
          />

          <input
            name="nom"
            value={form.nom}
            onChange={handle}
            required
            placeholder="Nom *"
            className="input"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handle}
            required
            placeholder="Email *"
            className="input col-span-2"
          />

          <input
            type="password"
            name="motDePasse"
            value={form.motDePasse}
            onChange={handle}
            required
            minLength={6}
            placeholder="Mot de passe (6+ caractères) *"
            className="input col-span-2"
          />

          <input
            name="telephone"
            value={form.telephone}
            onChange={handle}
            placeholder="Téléphone"
            className="input col-span-2"
          />

          <input
            name="adresse"
            value={form.adresse}
            onChange={handle}
            placeholder="Adresse"
            className="input"
          />

          <input
            name="ville"
            value={form.ville}
            onChange={handle}
            placeholder="Ville"
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary col-span-2 w-full mt-2"
          >
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà inscrit ?{' '}
          <Link
            to="/login"
            className="text-navy font-semibold hover:text-gold"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}