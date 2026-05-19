import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/80 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <BookOpen size={18} className="text-navy" />
            </div>
            <span className="font-serif text-xl font-bold text-white">MARINFO</span>
          </div>
          <p className="text-sm">Votre librairie culturelle en ligne au Maroc : livres, musique et films.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Catalogue</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/catalogue?categorieId=1" className="hover:text-gold">Livres</a></li>
            <li><a href="/catalogue?categorieId=2" className="hover:text-gold">CD audio</a></li>
            <li><a href="/catalogue?categorieId=3" className="hover:text-gold">DVD</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Aide</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gold">Livraison</a></li>
            <li><a href="#" className="hover:text-gold">Retour & remboursement</a></li>
            <li><a href="#" className="hover:text-gold">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin size={14}/> Fès, Maroc</li>
            <li className="flex items-center gap-2"><Mail size={14}/> contact@marinfo.ma</li>
            <li className="flex items-center gap-2"><Phone size={14}/> +212 5 35 00 00 00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4">
        © 2026 MARINFO — Projet académique FST Fès
      </div>
    </footer>
  );
}
