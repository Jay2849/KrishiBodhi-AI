import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [internId, setInternId] = useState('');
  
  // Error aur loading states handle karne ke liye
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    // Basic Form Validation
    if (!email || !password || (isRegister && (!name || !internId))) {
      setError('Bhai, saare fields bharo pehle!');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // ==========================================
        // 📝 SIGNUP API CALL
        // ==========================================
        const response = await axios.post('http://localhost:8000/auth/register', {
          name: name,
          intern_id: internId,
          email: email,
          password: password
        });
        
        // Registration successful hone par automatically Login mode par switch kar do
        alert('Supervisor profile successfully created! Ab login karo bhai.');
        setIsRegister(false);
        setError('');
      } else {
        // ==========================================
        // 🔑 LOGIN API CALL
        // ==========================================
        const response = await axios.post('http://localhost:8000/auth/login', {
          email: email,
          password: password
        });

        // Successful Login - Data ko App.jsx state matrix mein push karo
        if (response.data && response.data.supervisor_id) {
          onLoginSuccess(response.data);
        }
      }
    } catch (err) {
      // Backend se jo error detail aayegi, use display karo
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Server se connect nahi ho pa raha. Check karo backend live hai na?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F9F9FB] font-sans antialiased">
      
      {/* 🌲 Left Section: Brand Panel */}
      <div className="hidden md:flex flex-col justify-between bg-[#1E3F20] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [bg-size:16px_16px]"></div>
        <div className="relative z-10">
          <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/30">
            Project KrishiBodhi
          </span>
          <h2 className="text-white text-4xl font-extrabold tracking-tight mt-6 leading-tight max-w-md">
            Empowering Agriculture Through Modular Intelligence.
          </h2>
        </div>
        <div className="relative z-10 text-emerald-100/60 text-xs font-medium">
          <p>© 2026 KrishiBodhi AI Engine.</p>
          <p className="mt-1">Graphic Era Hill University Core Placement Project.</p>
        </div>
      </div>

      {/* 🔐 Right Section: The Auth Matrix Form */}
      <div className="flex items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isRegister ? "Join as Supervisor" : "Supervisor Portal"}
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              {isRegister ? "Create an internal operational profile." : "Enter your credentials to access field telemetry."}
            </p>
          </div>

          {/* ⚠️ Error Alert Banner */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-xs font-semibold text-red-700 animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm transition-all" 
                    placeholder="Jay Negi" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Intern ID</label>
                  <input 
                    type="text" 
                    value={internId}
                    onChange={(e) => setInternId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm transition-all" 
                    placeholder="KB-INT-2819" 
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm transition-all" 
                placeholder="supervisor@krishibodhi.ai" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secure Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#1E3F20] hover:bg-[#2e5931] text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm text-sm active:scale-[0.98] mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Syncing Engine Matrix..." : isRegister ? "Initialize Supervisor Profile" : "Authenticate & Sync"}
            </button>
          </form>

          <div className="text-center text-xs font-medium text-gray-400">
            {isRegister ? "Already tracking operations? " : "New supervisor on the field? "}
            <button 
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }} 
              className="text-[#1E3F20] font-bold hover:underline"
            >
              {isRegister ? "Sign In Here" : "Register Account"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}