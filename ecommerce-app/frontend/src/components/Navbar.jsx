import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f7f8f5]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-600 text-ink tracking-tight">
          Verdant
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-ink/80">
          <Link to="/" className="hover:text-brand-600">Shop</Link>
          <Link to="/cart" className="relative hover:text-brand-600">
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-ink/60">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-xs hover:bg-ink/5"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-brand-600">Log in</Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink/85"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
