import { BookOpen, Disc, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { Icon: BookOpen, label: 'Livres', className: 'left-8 top-10 rotate-[-8deg]' },
  { Icon: Disc, label: 'CD', className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[10deg]' },
  { Icon: Film, label: 'DVD', className: 'right-8 bottom-10 rotate-[7deg]' },
];

export default function Hero3D() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white/10 backdrop-blur border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-gold/20" />
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />

      {items.map(({ Icon, label, className }, index) => (
        <motion.div
          key={label}
          className={`absolute ${className} flex h-36 w-32 flex-col items-center justify-center rounded-2xl bg-white/95 text-navy shadow-2xl`}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
          transition={{
            opacity: { delay: index * 0.15, duration: 0.5 },
            y: { duration: 4 + index, repeat: Infinity, ease: 'easeInOut' },
            scale: { delay: index * 0.15, duration: 0.5 },
          }}
        >
          <Icon size={42} className="text-gold" />
          <span className="mt-3 font-serif text-xl font-bold">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
