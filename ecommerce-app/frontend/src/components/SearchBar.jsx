import React from 'react';

export default function SearchBar({ search, setSearch, category, setCategory, categories }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products by name, category, or description…"
        className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:flex-1"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 sm:w-48"
      >
        <option value="All">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
