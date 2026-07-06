import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p className="mx-auto max-w-4xl px-6 py-10 text-ink/50">Loading cart…</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-700 text-ink">Your cart</h1>

      {cart.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-black/5 bg-white p-10 text-center">
          <p className="text-ink/60">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
            {cart.map((item) => (
              <div key={item.product._id} className="flex items-center gap-4 p-4">
                <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-display text-base font-600 text-ink">{item.product.name}</h3>
                  <p className="text-sm text-ink/50">${item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                    className="h-8 w-8 rounded-full border border-black/10 hover:bg-ink/5"
                  >−</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-black/10 hover:bg-ink/5"
                  >+</button>
                </div>
                <div className="w-20 text-right font-semibold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-black/5 bg-white p-6">
            <div>
              <p className="text-sm text-ink/50">Subtotal</p>
              <p className="font-display text-2xl font-700 text-ink">${subtotal.toFixed(2)}</p>
            </div>
            <button
              onClick={() => (user ? navigate('/checkout') : navigate('/login'))}
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
            >
              {user ? 'Proceed to checkout' : 'Log in to check out'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
