import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16 flex-grow w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Portal Authentication</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Secure portal access for authorized field supervisors and coordinators.</p>
          <div className="bg-gray-50 p-4 rounded text-center text-sm text-gray-600 border border-dashed border-gray-200">
            [ Placeholder: System Authentication Interface Component ]
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}