import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [internId, setInternId] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        await axios.post('http://localhost:8000/auth/register', {
          name: name,
          intern_id: internId,
          email: email,
          password: password
        });
        
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

        if (response.data && response.data.access_token) {
          // Token matrix local persistent vault mein bind karo (Week 6 Security Requirement)
          localStorage.setItem('token', response.data.access_token);
          onLoginSuccess(response.data);
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Server execution error or Rate Limit Exceeded (429)!');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🌐 GOOGLE OAUTH FLOW SIMULATION INTERCEPTOR
  // ==========================================
  const handleGoogleOAuthLogin = async () => {
    setError('');
    setLoading(true);
    try {
      console.log("Redirecting system engine to Google OAuth authentication consent module...");
      
      const response = await axios.post('http://localhost:8000/auth/oauth/callback', {
        email: "jay.negi.oauth@krishibodhi.ai",
        name: "Jay Negi OAuth Supervisor",
        provider: "google"
      });

      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError('OAuth processing gateway validation error. Check backend configurations.');
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

          {/* ⚠️ Error Alert Banner / 429 Status Indicator */}
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

          {/* ==========================================
              🌐 OAUTH SIGN-IN TRIGGER LAYOUT BRIDGE
             ========================================== */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">Or Matrix Connect</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleOAuthLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.29 0 3.264 2.69 1.255 6.627l4.01 3.138z"/>
              <path fill="#4285F4" d="M23.636 12.273c0-.818-.073-1.609-.209-2.373H12v4.582h6.527c-.281 1.49-1.127 2.754-2.39 3.6l3.709 2.873c2.164-1.99 3.41-4.92 3.41-8.682z"/>
              <path fill="#FBBC05" d="M5.266 14.235A7.015 7.015 0 0 1 4.909 12c0-.79.136-1.545.357-2.235L1.255 6.627A11.933 11.933 0 0 0 0 12c0 1.92.455 3.736 1.255 5.373l4.011-3.138z"/>
              <path fill="#34A853" d="M12 24c3.245 0 5.973-1.073 7.964-2.918l-3.709-2.873c-1.027.682-2.336 1.091-4.255 1.091-3.264 0-6.036-2.21-7.018-5.173L.973 17.264C2.982 21.209 7.01 24 12 24z"/>
            </svg>
            Sign in with Google Account
          </button>

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