import React, { useState, useEffect } from 'react';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Loader from './components/ui/Loader';
import Toast from './components/ui/Toast';
import Modal from './components/ui/Modal';

export default function App() {
  // Theme State (Dark/Light)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // UI Components States
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  // Handle Theme Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() === '') {
      setInputError('Field supervisor input cannot be empty');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      
      {/* HEADER / NAVBAR */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">KrishiBodhi AI</h1>
          <nav className="flex items-center gap-6">
            <span className="text-sm font-medium opacity-75 cursor-pointer">Dashboard</span>
            <span className="text-sm font-medium opacity-75 cursor-pointer">About</span>
            
            {/* THEME TOGGLE BUTTON (Deliverable 4) */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:opacity-80 text-lg"
              title="Toggle Theme"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
        
        {/* HERO SECTION */}
        <section className="text-center py-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Week 3 UI Component Library
          </h2>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            Showcase room for verified UI elements and adaptive system configurations.
          </p>
        </section>

        {/* COMPONENT INTERACTION GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. BUTTONS & LOADER CARD */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b pb-2 border-slate-100 dark:border-slate-800">1. Buttons & Loader Showcase</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => alert('Primary action triggered')}>Primary Button</Button>
              <Button variant="secondary" onClick={() => alert('Secondary action triggered')}>Secondary</Button>
              <Button variant="danger" onClick={() => alert('Danger action triggered')}>Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button variant="primary" isLoading={true}>Processing</Button>
            </div>
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-4">
              <Loader size="sm" text="Fetching regional metrics..." />
            </div>
          </div>

          {/* 2. INPUT FIELD CARD */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b pb-2 border-slate-100 dark:border-slate-800">2. Input Control</h3>
            <Input 
              label="Supervisor ID Entry" 
              placeholder="e.g. TBI-26100221"
              value={inputValue}
              onChange={handleInputChange}
              error={inputError}
            />
          </div>

          {/* 3. MODAL AND TOAST TRIGGERS */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4 md:col-span-2">
            <h3 className="text-lg font-bold border-b pb-2 border-slate-100 dark:border-slate-800">3. Global Modals & Notifications</h3>
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setModalOpen(true)}>Open Action Modal</Button>
              <Button variant="secondary" onClick={() => setToastVisible(true)}>Trigger Success Toast</Button>
            </div>
          </div>

        </section>
      </main>

      {/* OVERLAY ELEMENTS */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="System Parameters Verification">
        <p className="mb-4">This action template confirms data synchronization with local high-altitude parameters inside Uttarakhand ecosystems.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { setModalOpen(false); alert('Confirmed'); }}>Confirm Data</Button>
        </div>
      </Modal>

      <Toast 
        message="Metrics successfully updated via local cloud grid!" 
        type="success" 
        isVisible={toastVisible} 
        onClose={() => setToastVisible(false)} 
      />

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 text-center py-6 text-xs opacity-60">
        © 2026 KrishiBodhi AI. Intern Identification: TBI-26100221
      </footer>

    </div>
  );
}