import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Core Application Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            badge="UI/UX"
            title="Locally-Constrained Chat" 
            description="A clean, minimal user interface optimized to load quickly and function smoothly even under weak or patchy 2G/3G mobile networks in remote villages."
          />
          <Card 
            badge="AI Engine"
            title="Contextual Regional Advisory" 
            description="An AI system configured to suggest only low-cost, organic solutions using materials strictly available within Uttarakhand's mountain ecosystem."
          />
          <Card 
            badge="Safety"
            title="Official Disclaimer Engine" 
            description="A critical safety feature that automatically appends verification notices prompting users to double-check advice with licensed extension officers."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}