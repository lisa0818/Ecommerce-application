import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-700 text-ink">Create your account</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required placeholder="Full name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="email" required placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="password" required placeholder="Password (min 6 characters)"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Already have an account? <Link to="/login" className="font-semibold text-brand-600">Log in</Link>
      </p>
    </div>
  );
}
