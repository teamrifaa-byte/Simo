import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {

  const { login } = useAuth();

  const nav = useNavigate();

  const [params] = useSearchParams();

  const [form, setForm] = useState({
    email: '',
    motDePasse: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await login(
        form.email,
        form.motDePasse
      );

      toast.success('Bienvenue !');

      nav(
        params.get('next') || '/catalogue'
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        'Identifiants invalides'
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
        className="card p-8 w-full max-w-md"
      >

        <h1 className="font-serif text-3xl text-navy mb-2">
          Connexion
        </h1>

        <p className="text-gray-500 mb-6">
          Accédez à votre compte client
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              className="input pl-10"
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              required
              placeholder="Mot de passe"
              value={form.motDePasse}
              onChange={(e) =>
                setForm({
                  ...form,
                  motDePasse: e.target.value
                })
              }
              className="input pl-10"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >

            {loading
              ? 'Connexion…'
              : 'Se connecter'}

          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-navy font-semibold hover:text-gold"
          >
            S'inscrire
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-2">
          Compte de test :
          {' '}
          yassine@test.ma / client123
        </p>

        <p className="text-center text-xs text-gray-400 mt-1">
          Administrateur ?
          {' '}
          <Link
            to="/admin/login"
            className="text-navy hover:text-gold"
          >
            Accès admin
          </Link>
        </p>

      </motion.div>

    </div>
  );
}