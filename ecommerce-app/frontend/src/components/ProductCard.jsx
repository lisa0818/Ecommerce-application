import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    await addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:shadow-lg hover:shadow-black/5">
      <div className="aspect-[4/3] overflow-hidden bg-brand-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Product'; }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h3 className="font-display text-lg font-600 leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink/60">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-xl font-600 text-ink">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              added ? 'bg-brand-500 text-white' : 'bg-ink text-white hover:bg-ink/85'
            }`}
          >
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
