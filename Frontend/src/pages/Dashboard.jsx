import React, { useState } from 'react';
import axios from 'axios';

export default function Dashboard({ supervisor, onLogout }) {
  // Static placeholder fallback records, inme naye entries append hoti rahengi
  const [records, setRecords] = useState([
    { id: 1, name: "Ramesh Singh", date: "27 June 2026", moisture: 28.5, temperature: 34.2, advisory: "Soil moisture is critically low. Immediate irrigation required. Suggest adding Nitrogen-rich compost." },
    { id: 2, name: "Harish Negi", date: "25 June 2026", moisture: 42.0, temperature: 29.5, advisory: "Soil moisture levels are optimal. Maintain current watering cycle. NPK balancing is stable." }
  ]);

  const [selectedRecord, setSelectedRecord] = useState(records[0]);
  const [showForm, setShowForm] = useState(false);

  // Form Inputs State Management
  const [farmerName, setFarmerName] = useState('');
  const [moisture, setMoisture] = useState('');
  const [temp, setTemp] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [loading, setLoading] = useState(false);

  // ==========================================
  // ⚡ AXIOS METRICS SUBMISSION HANDLER
  // ==========================================
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!farmerName || !moisture || !temp || !nitrogen || !phosphorus || !potassium) {
      alert('Bhai, khet ki saari telemetry entries dhyan se bharo!');
      return;
    }

    setLoading(true);
    // Logged in supervisor ka internal sequence matrix ID use karenge
    const activeSupervisorId = supervisor?.supervisor_id || 1; 

    try {
      const response = await axios.post(`http://localhost:8000/metrics/submit?supervisor_id=${activeSupervisorId}`, {
        farmer_name: farmerName,
        soil_moisture: parseFloat(moisture),
        nitrogen_level: parseFloat(nitrogen),
        phosphorus_level: parseFloat(phosphorus),
        potassium_level: parseFloat(potassium),
        temperature: parseFloat(temp)
      });

      if (response.data && response.data.id) {
        // Naye compiled model result ko map karo interface ke liye
        const newRecord = {
          id: response.data.id,
          name: response.data.farmer_name,
          date: new Date(response.data.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          moisture: response.data.soil_moisture,
          temperature: response.data.temperature,
          advisory: response.data.ai_advisory
        };

        setRecords([newRecord, ...records]);
        setSelectedRecord(newRecord);
        setShowForm(false); // Back to history matrix view

        // Clear Form fields
        setFarmerName(''); setMoisture(''); setTemp('');
        setNitrogen(''); setPhosphorus(''); setPotassium('');
      }
    } catch (err) {
      console.error(err);
      alert('Metrics processing telemetry synchronization failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-gray-800 font-sans antialiased">
      {/* 🟢 Top Control Bar */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#1E3F20]">KrishiBodhi AI Dashboard</h1>
          <p className="text-xs text-gray-400 font-medium">Welcome, {supervisor?.name || 'Field Supervisor'}</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#1E3F20] hover:bg-[#2e5931] text-white font-medium text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
        >
          {showForm ? "View History" : "➕ New Field Metrics"}
        </button>
      </header>

      {/* 📊 Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 📋 Left Section: Records List */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-1">Recent Evaluations</h2>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
            {records.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedRecord(item)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  selectedRecord.id === item.id 
                    ? 'bg-white border-[#1E3F20] shadow-md ring-1 ring-[#1E3F20]' 
                    : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full font-medium">{item.date}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>💧 Moisture: {item.moisture}%</span>
                  <span>🌡️ Temp: {item.temperature}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🛡️ Right Section: Telemetry & Dynamic AI Advisory Output */}
        <div className="md:col-span-2 space-y-6">
          {showForm ? (
            /* 📝 Dynamic Data Entry Form Card */
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Record Field Diagnostics</h2>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Farmer Full Name</label>
                  <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 transition-all text-sm" placeholder="Enter farmer name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Soil Moisture (%)</label>
                  <input type="number" step="any" value={moisture} onChange={(e) => setMoisture(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 transition-all text-sm" placeholder="e.g. 24.5" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Temperature (°C)</label>
                  <input type="number" step="any" value={temp} onChange={(e) => setTemp(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 transition-all text-sm" placeholder="e.g. 32.0" />
                </div>
                <div className="sm:col-span-2 grid grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nitrogen (N)</label>
                    <input type="number" step="any" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-sm" placeholder="N" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Phosphorus (P)</label>
                    <input type="number" step="any" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-sm" placeholder="P" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Potassium (K)</label>
                    <input type="number" step="any" value={potassium} onChange={(e) => setPotassium(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-sm" placeholder="K" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="sm:col-span-2 w-full mt-4 bg-[#1E3F20] text-white font-medium py-3 rounded-xl hover:bg-[#2e5931] transition-colors text-sm shadow-sm disabled:opacity-50">
                  {loading ? "Analyzing Matrix Layer..." : "Analyze Metrics with KrishiBodhi AI 🤖"}
                </button>
              </form>
            </div>
          ) : (
            /* 🖥️ Selected Record Details View */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Currently Selected Profiling</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-0.5">{selectedRecord.name}</h2>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>Log Timestamp</p>
                  <p className="font-semibold text-gray-600 mt-0.5">{selectedRecord.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                  <p className="text-xs font-semibold text-gray-400">💧 Moisture</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedRecord.moisture}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                  <p className="text-xs font-semibold text-gray-400">🌡️ Temp</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedRecord.temperature}°C</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                  <p className="text-xs font-semibold text-gray-400">🌿 N-P-K Status</p>
                  <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Monitored</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                  <p className="text-xs font-semibold text-gray-400">📍 Region</p>
                  <p className="text-sm font-bold text-gray-700 mt-1.5">Bhimtal Campus Hub</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/10">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-bold text-[#1E3F20] text-base">KrishiBodhi AI Intelligent Recommendation</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-1">
                  {selectedRecord.advisory}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}