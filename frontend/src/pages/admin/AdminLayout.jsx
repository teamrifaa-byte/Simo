import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Layers,
  RefreshCw, LogOut, BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin',                 label: 'Dashboard',       Icon: LayoutDashboard, end: true },
  { to: '/admin/articles',        label: 'Articles',        Icon: Package },
  { to: '/admin/categories',      label: 'Catégories',      Icon: Layers },
  { to: '/admin/commandes',       label: 'Commandes',       Icon: ShoppingCart },
  { to: '/admin/promotions',      label: 'Promotions',      Icon: Tag },
  { to: '/admin/reapprovisionnements', label: 'Réapprovisionnement', Icon: RefreshCw },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-navy text-white min-h-screen flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gold rounded flex items-center justify-center">
                <BookOpen size={18} className="text-navy" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold">MARINFO</p>
                <p className="text-xs text-gold">Backoffice</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive ? 'bg-navy-dark text-gold border-l-4 border-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}>
                <l.Icon size={18}/>
                <span className="text-sm font-medium">{l.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/60">Connecté</p>
            <p className="text-sm font-semibold mb-3">{user?.nomComplet}</p>
            <button onClick={() => { logout(); nav('/admin/login'); }}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-gold transition">
              <LogOut size={16}/> Déconnexion
            </button>
          </div>
        </aside>

        {/* Main */}
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-8">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
