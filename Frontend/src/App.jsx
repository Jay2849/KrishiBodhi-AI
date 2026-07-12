import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Loader from './components/ui/Loader';
import Toast from './components/ui/Toast';
import Modal from './components/ui/Modal';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [currentModule, setCurrentModule] = useState('login'); 
  const [supervisor, setSupervisor] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  // ==========================================
  // 🛡️ AXIOS AUTHORIZATION INTERCEPTOR HEADERS
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (currentModule === 'login') {
        setCurrentModule('dashboard');
      }
    }
  }, [currentModule]);

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

  const handleLoginSuccess = (supervisorData) => {
    setSupervisor(supervisorData);
    setCurrentModule('dashboard');
  };

  const handleLogout = () => {
    // Session persistent layer properties clear block
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setSupervisor(null);
    setCurrentModule('login');
  };

  // 🛡️ Protected Module Navigation State Guard Validation Check
  const secureModuleSwitch = (targetModule) => {
    const activeToken = localStorage.getItem('token');
    if (!activeToken && (targetModule === 'dashboard' || targetModule === 'week3')) {
      alert("Unauthorized Access Attempt (401)! Pehle Login Karo Bhaii.");
      setCurrentModule('login');
    } else {
      setCurrentModule(targetModule);
    }
  };

  return (
    <div className="relative">
      
      {/* 🧭 Academic Matrix Evaluation Switcher Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-6 py-2 flex justify-between items-center font-mono border-b border-slate-800 z-50 relative">
        <span>System Module: <strong className="text-emerald-400 font-bold uppercase">{currentModule}</strong></span>
        <div className="flex gap-4">
          <button onClick={() => secureModuleSwitch('week3')} className="hover:text-emerald-400 transition-colors">📁 Week 3 UI Library</button>
          <button onClick={() => secureModuleSwitch('dashboard')} className="hover:text-emerald-400 transition-colors">📊 Dashboard Layer</button>
          <button onClick={() => setCurrentModule('login')} className="hover:text-emerald-400 transition-colors">🔐 Live Portal Gate</button>
        </div>
      </div>

      {/* 🖥️ DYNAMIC RENDER ROUTING MATRIX */}
      <div>
        {currentModule === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentModule === 'dashboard' && (
          <Dashboard supervisor={supervisor} onLogout={handleLogout} />
        )}

        {currentModule === 'week3' && (
          <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
            {/* HEADER / NAVBAR */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40">
              <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">KrishiBodhi AI</h1>
                <nav className="flex items-center gap-6">
                  <span onClick={() => secureModuleSwitch('dashboard')} className="text-sm font-medium opacity-75 cursor-pointer hover:text-emerald-400">Dashboard</span>
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
              <section className="text-center py-6">
                <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-slate-900 dark:text-white">
                  Week 3 UI Component Library
                </h2>
                <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
                  Showcase room for verified UI elements and adaptive system configurations.
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4 md:col-span-2">
                  <h3 className="text-lg font-bold border-b pb-2 border-slate-100 dark:border-slate-800">3. Global Modals & Notifications</h3>
                  <div className="flex gap-4">
                    <Button variant="primary" onClick={() => setModalOpen(true)}>Open Action Modal</Button>
                    <Button variant="secondary" onClick={() => setToastVisible(true)}>Trigger Success Toast</Button>
                  </div>
                </div>
              </section>
            </main>

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

            <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 text-center py-6 text-xs opacity-60">
              © 2026 KrishiBodhi AI. Intern Identification Framework Alignment.
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}