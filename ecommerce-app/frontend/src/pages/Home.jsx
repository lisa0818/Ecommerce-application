import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  // Re-fetch whenever search or category changes (debounced on search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get('/products', { params: { search, category } })
        .then((res) => { setProducts(res.data); setError(''); })
        .catch(() => setError('Could not load products. Is the backend running?'))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-700 text-ink">Everyday goods, thoughtfully made.</h1>
        <p className="mt-2 max-w-xl text-ink/60">
          Browse the full catalog, or search by name or category to find exactly what you need.
        </p>
      </div>

      <div className="mb-8">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-ink/50">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-ink/50">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
