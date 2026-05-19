import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'marinfo_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (article, quantite = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === article.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantite: next[idx].quantite + quantite };
        return next;
      }
      return [...prev, {
        id: article.id,
        titre: article.titre,
        prix: article.prixFinal ?? article.prix,
        imageUrl: article.imageUrl,
        stock: article.stock,
        quantite,
      }];
    });
  };

  const removeItem = (id)         => setItems((p) => p.filter((i) => i.id !== id));
  const updateQty  = (id, qty)    => setItems((p) => p.map((i) => i.id === id ? { ...i, quantite: Math.max(1, qty) } : i));
  const clear      = ()           => setItems([]);

  const total      = items.reduce((s, i) => s + Number(i.prix) * i.quantite, 0);
  const count      = items.reduce((s, i) => s + i.quantite, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
