import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-700 text-ink">Welcome back</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="email" required placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        <input
          type="password" required placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand-500"
        />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Don't have an account? <Link to="/register" className="font-semibold text-brand-600">Sign up</Link>
      </p>
    </div>
  );
}
