// Navbar component for KrishiBodhi AI responsive layout
import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-xl font-bold tracking-wide">KrishiBodhi AI</h1>
        <div className="flex gap-4 text-sm font-medium">
          <a href="/" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/login" className="hover:underline">Login</a>
        </div>
      </div>
    </nav>
  );
}