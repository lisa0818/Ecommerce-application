import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/api';

const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.08;

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', street: '', city: '', state: '', zip: '', country: '',
    cardNumber: '', expiry: '', cvv: '',
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING_FEE + tax;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePay(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const res = await api.post('/orders/checkout', {
        shippingAddress: {
          fullName: form.fullName, street: form.street, city: form.city,
          state: form.state, zip: form.zip, country: form.country,
        },
        cardNumber: form.cardNumber,
      });
      setSuccess(res.data.order);
      await clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-10">
          <h1 className="font-display text-3xl font-700 text-brand-900">Payment successful 🎉</h1>
          <p className="mt-2 text-ink/70">
            Order <span className="font-mono">{success._id}</span> — total ${success.totalPrice.toFixed(2)}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-ink/60">
        Your cart is empty. Add items before checking out.
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={handlePay} className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-700 text-ink">Shipping address</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <input name="fullName" required placeholder="Full name" value={form.fullName} onChange={handleChange} className="col-span-2 rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="street" required placeholder="Street address" value={form.street} onChange={handleChange} className="col-span-2 rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="city" required placeholder="City" value={form.city} onChange={handleChange} className="rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="state" required placeholder="State" value={form.state} onChange={handleChange} className="rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="zip" required placeholder="ZIP code" value={form.zip} onChange={handleChange} className="rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="country" required placeholder="Country" value={form.country} onChange={handleChange} className="rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-700 text-ink">Payment (simulated)</h2>
          <p className="mt-1 text-xs text-ink/50">
            No real charge is made. Enter any 13–19 digit number to simulate a payment.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <input name="cardNumber" required placeholder="Card number" value={form.cardNumber} onChange={handleChange} className="col-span-2 rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="expiry" required placeholder="MM/YY" value={form.expiry} onChange={handleChange} className="rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
            <input name="cvv" required placeholder="CVV" value={form.cvv} onChange={handleChange} className="rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500" />
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="w-full rounded-full bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {placing ? 'Processing payment…' : `Pay $${total.toFixed(2)}`}
        </button>
      </form>

      <div className="h-fit rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-xl font-700 text-ink">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between text-ink/70">
              <span>{item.product.name} × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
          <div className="flex justify-between text-ink/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-ink/60"><span>Shipping</span><span>${SHIPPING_FEE.toFixed(2)}</span></div>
          <div className="flex justify-between text-ink/60"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-black/5 pt-2 text-base font-700 text-ink"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
