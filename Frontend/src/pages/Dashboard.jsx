import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Supervisor Dashboard</h1>
        <p className="text-gray-700 leading-relaxed">
          Welcome to the analytical view. This section will eventually display regional alert logs, crop health statistics, and system diagnostic metrics for field agents operating in the field.
        </p>
      </main>
      <Footer />
    </div>
  );
}