import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(form.email, form.motDePasse);
      toast.success('Connexion admin réussie');
      nav('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants invalides');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="card p-8 w-full max-w-md">
        <div className="bg-navy text-gold w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Shield size={26}/>
        </div>
        <h1 className="font-serif text-3xl text-navy text-center">Espace Administrateur</h1>
        <p className="text-gray-500 text-center mb-6">MARINFO Backoffice</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" required placeholder="Email administrateur"
                   value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                   className="input pl-10" />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" required placeholder="Mot de passe"
                   value={form.motDePasse}
                   onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                   className="input pl-10" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Compte par défaut : admin@marinfo.ma / admin123
        </p>
      </motion.div>
    </div>
  );
}
