import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">About KrishiBodhi AI</h1>
        <p className="text-gray-700 leading-relaxed">
          This system integrates the Gemini API within a highly tuned FastAPI backend, wrapped with a strictly engineered system prompt. It acts as a digital guardrail to ensure the platform remains strictly domain-focused on the high-altitude agricultural requirements of the Mandakini Collective.
        </p>
      </main>
      <Footer />
    </div>
  );
}