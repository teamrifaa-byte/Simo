import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, LogOut, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-white/80 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-navy" />
            </motion.div>
            <span className="font-serif text-2xl font-bold tracking-wide">MARINFO</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Accueil</NavLink>
            <NavLink to="/catalogue" className={linkClass}>Catalogue</NavLink>
            <NavLink to="/catalogue?categorieId=1" className={linkClass}>Livres</NavLink>
            <NavLink to="/catalogue?categorieId=2" className={linkClass}>CD</NavLink>
            <NavLink to="/catalogue?categorieId=3" className={linkClass}>DVD</NavLink>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative text-white hover:text-gold transition-colors p-2">
              <ShoppingCart size={22} />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link to="/admin" className="btn-gold !py-2 !px-4 text-sm">Dashboard</Link>
                ) : (
                  <Link to="/mes-commandes" className="text-white hover:text-gold transition flex items-center gap-1 text-sm">
                    <User size={18} /> {user.nomComplet?.split(' ')[0]}
                  </Link>
                )}
                <button onClick={() => { logout(); nav('/'); }}
                        className="text-white/70 hover:text-white p-2" title="Déconnexion">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-gold !py-2 !px-4 text-sm">Connexion</Link>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="md:hidden pb-4 border-t border-white/10">
            <NavLink to="/" className="block py-2 text-white/90">Accueil</NavLink>
            <NavLink to="/catalogue" className="block py-2 text-white/90">Catalogue</NavLink>
            <NavLink to="/cart" className="block py-2 text-white/90">Panier ({count})</NavLink>
            {user ? (
              <>
                <NavLink to={isAdmin ? '/admin' : '/mes-commandes'} className="block py-2 text-white/90">
                  {isAdmin ? 'Dashboard' : 'Mes commandes'}
                </NavLink>
                <button onClick={() => { logout(); nav('/'); }} className="block py-2 text-white/90">Déconnexion</button>
              </>
            ) : (
              <NavLink to="/login" className="block py-2 text-gold">Connexion</NavLink>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
