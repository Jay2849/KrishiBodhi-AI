import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import EditModal from '../components/EditModal';

export default function Dashboard({ supervisor, onLogout }) {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(true);

  // Search / Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);

  // Form Inputs State Management
  const [farmerName, setFarmerName] = useState('');
  const [moisture, setMoisture] = useState('');
  const [temp, setTemp] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  
  // Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // ==========================================
  // 📥 READ (GET): FETCH REAL METRICS FROM API
  // ==========================================
  const loadSupervisorMetrics = async () => {
    setLoadingRecords(true);
    try {
      const response = await api.get('/metrics/supervisor/me');
      if (response.data && Array.isArray(response.data)) {
        const formatted = response.data.map(item => ({
          id: item.id,
          name: item.farmer_name,
          date: new Date(item.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          moisture: item.soil_moisture,
          temperature: item.temperature,
          nitrogen: item.nitrogen_level,
          phosphorus: item.phosphorus_level,
          potassium: item.potassium_level,
          advisory: item.ai_advisory || "AI Analytics Complete."
        }));
        setRecords(formatted);
        if (formatted.length > 0) {
          setSelectedRecord(formatted[0]);
        } else {
          setSelectedRecord(null);
        }
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadSupervisorMetrics();
  }, []);

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Filtered records by search query
  const filteredRecords = records.filter(rec =>
    rec.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==========================================
  // 📝 CREATE (POST): SUBMIT FIELD METRICS & GEMINI AI ADVISORY
  // ==========================================
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!farmerName || !moisture || !temp || !nitrogen || !phosphorus || !potassium) {
      alert('Field telemetry inputs missing. Please fill all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.post('/metrics/submit', {
        farmer_name: farmerName,
        soil_moisture: parseFloat(moisture),
        nitrogen_level: parseFloat(nitrogen),
        phosphorus_level: parseFloat(phosphorus),
        potassium_level: parseFloat(potassium),
        temperature: parseFloat(temp)
      });

      if (response.data && response.data.id) {
        const newRecord = {
          id: response.data.id,
          name: response.data.farmer_name,
          date: new Date(response.data.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          moisture: response.data.soil_moisture,
          temperature: response.data.temperature,
          nitrogen: response.data.nitrogen_level,
          phosphorus: response.data.phosphorus_level,
          potassium: response.data.potassium_level,
          advisory: response.data.ai_advisory || "AI Processing successful."
        };

        setRecords([newRecord, ...records]);
        setSelectedRecord(newRecord);
        setShowForm(false);

        // Reset form
        setFarmerName(''); setMoisture(''); setTemp('');
        setNitrogen(''); setPhosphorus(''); setPotassium('');
        triggerToast("🎉 Field telemetry successfully recorded & analyzed with Gemini AI!");
      }
    } catch (err) {
      console.error("AI Submission Error:", err);
      if (err.response?.status === 401) {
        setErrorMessage("Your security session token has expired. Please re-login to get a fresh token.");
      } else {
        const extractedError = err.response?.data?.detail || "AI Engine Gateway offline or network error.";
        setErrorMessage(extractedError);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🔄 UPDATE (PUT): MODAL SAVE HANDLER
  // ==========================================
  const openEditModal = (rec) => {
    setRecordToEdit(rec);
    setIsEditOpen(true);
  };

  const handleSaveEditedRecord = async (id, updatedData) => {
    try {
      const response = await api.put(`/metrics/update/${id}`, updatedData);
      if (response.status === 200) {
        const recData = response.data.record || {};
        const updatedList = records.map(rec => {
          if (rec.id === id) {
            return {
              ...rec,
              name: updatedData.farmer_name || rec.name,
              moisture: updatedData.soil_moisture !== undefined ? updatedData.soil_moisture : rec.moisture,
              temperature: updatedData.temperature !== undefined ? updatedData.temperature : rec.temperature,
              nitrogen: updatedData.nitrogen_level !== undefined ? updatedData.nitrogen_level : rec.nitrogen,
              phosphorus: updatedData.phosphorus_level !== undefined ? updatedData.phosphorus_level : rec.phosphorus,
              potassium: updatedData.potassium_level !== undefined ? updatedData.potassium_level : rec.potassium,
              advisory: recData.ai_advisory || rec.advisory
            };
          }
          return rec;
        });
        setRecords(updatedList);
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord({
            ...selectedRecord,
            name: updatedData.farmer_name || selectedRecord.name,
            moisture: updatedData.soil_moisture !== undefined ? updatedData.soil_moisture : selectedRecord.moisture,
            temperature: updatedData.temperature !== undefined ? updatedData.temperature : selectedRecord.temperature,
            nitrogen: updatedData.nitrogen_level !== undefined ? updatedData.nitrogen_level : selectedRecord.nitrogen,
            phosphorus: updatedData.phosphorus_level !== undefined ? updatedData.phosphorus_level : selectedRecord.phosphorus,
            potassium: updatedData.potassium_level !== undefined ? updatedData.potassium_level : selectedRecord.potassium,
            advisory: recData.ai_advisory || selectedRecord.advisory
          });
        }
        triggerToast("✏️ Record successfully updated in database!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update record on backend.");
    }
  };

  // ==========================================
  // 🗑️ DELETE (DELETE): REMOVE RECORD HANDLER
  // ==========================================
  const handleDeleteRecord = async (id) => {
    if (!confirm("Are you sure you want to permanently purge this evaluation record?")) return;

    try {
      const response = await api.delete(`/metrics/delete/${id}`);
      if (response.status === 200) {
        const filteredList = records.filter(rec => rec.id !== id);
        setRecords(filteredList);
        if (filteredList.length > 0) {
          setSelectedRecord(filteredList[0]);
        } else {
          setSelectedRecord(null);
        }
        triggerToast("🗑️ Metric record deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete record from backend.");
    }
  };

  // Helper function to format AI Advisory markdown into styled UI blocks
  const renderFormattedAdvisory = (advisoryText) => {
    if (!advisoryText) return null;

    const parts = advisoryText.split(/(?=\*\*(?:Status Alert|Action Required):\*\*)/gi);
    
    return (
      <div className="space-y-3 mt-2">
        {parts.map((part, index) => {
          const isAlert = part.toLowerCase().includes("status alert");
          const isAction = part.toLowerCase().includes("action required");
          const cleanText = part.replace(/\*\*(?:Status Alert|Action Required):\*\*/gi, '').trim();

          if (isAlert) {
            return (
              <div key={index} className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-900 font-medium leading-relaxed">
                <span className="font-bold text-amber-950 uppercase text-[10px] tracking-wide block mb-1">⚠️ Status Alert</span>
                {cleanText}
              </div>
            );
          } else if (isAction) {
            return (
              <div key={index} className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-xs text-emerald-900 font-medium leading-relaxed">
                <span className="font-bold text-emerald-950 uppercase text-[10px] tracking-wide block mb-1">💡 Action Required</span>
                {cleanText}
              </div>
            );
          }
          return cleanText ? <p key={index} className="text-xs text-gray-600">{cleanText}</p> : null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-gray-800 font-sans antialiased">
      
      {/* 🟢 Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1E3F20] text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500 text-xs font-bold animate-bounce flex items-center gap-2">
          <span>{successToast}</span>
        </div>
      )}

      {/* 🟢 Top Control Bar */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#1E3F20]">KrishiBodhi AI Dashboard</h1>
          <p className="text-xs text-gray-400 font-medium">Field Supervisor Portal | {supervisor?.name || 'Active Session'}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setShowForm(!showForm);
              setErrorMessage('');
            }}
            className="bg-[#1E3F20] hover:bg-[#2e5931] text-white font-medium text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {showForm ? "📋 View History" : "➕ New Field Metrics"}
          </button>
          {onLogout && (
            <button onClick={onLogout} className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors px-2 cursor-pointer">
              Logout
            </button>
          )}
        </div>
      </header>

      {/* 📊 Main Content Area */}
      <main className="max-w-7xl mx-auto p-6">
        
        {loadingRecords ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-400 font-semibold">Connecting to KrishiBodhi Database & Loading Telemetry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 📋 Left Section: Records List */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Evaluations</h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{records.length} Total</span>
              </div>

              {/* 🔍 Search Input Filter */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search farmer name..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-none focus:border-[#1E3F20] transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600">✕</button>
                )}
              </div>
              
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
                {filteredRecords.length === 0 ? (
                  <div className="p-6 bg-white border border-gray-100 rounded-2xl text-center text-xs text-gray-400">
                    {searchQuery ? `No evaluations match "${searchQuery}"` : 'No field evaluations found. Click "+ New Field Metrics" to begin.'}
                  </div>
                ) : (
                  filteredRecords.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedRecord(item)}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        selectedRecord && selectedRecord.id === item.id 
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
                  ))
                )}
              </div>
            </div>

            {/* 🛡️ Right Section: Telemetry & Dynamic AI Advisory Output / Empty State / Form */}
            <div className="md:col-span-2 space-y-6">
              {showForm ? (
                /* 📝 Dynamic Data Entry Form Card */
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Record Field Diagnostics</h2>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold">Gemini 1.5 Flash Connected</span>
                  </div>
                  
                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm flex justify-between items-center gap-3">
                      <div>❌ <strong>AI Sync Alert:</strong> {errorMessage}</div>
                      {onLogout && (
                        <button type="button" onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 cursor-pointer">
                          Re-Login Now 🔑
                        </button>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Farmer Full Name</label>
                      <input type="text" disabled={loading} value={farmerName} onChange={(e) => setFarmerName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm" placeholder="Enter farmer name (e.g., Ramesh Singh)" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Soil Moisture (%)</label>
                      <input type="number" step="any" disabled={loading} value={moisture} onChange={(e) => setMoisture(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm" placeholder="e.g. 24.5" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Temperature (°C)</label>
                      <input type="number" step="any" disabled={loading} value={temp} onChange={(e) => setTemp(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] bg-gray-50/50 text-sm" placeholder="e.g. 32.0" required />
                    </div>
                    <div className="sm:col-span-2 grid grid-cols-3 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Nitrogen (N)</label>
                        <input type="number" step="any" disabled={loading} value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-sm" placeholder="N" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Phosphorus (P)</label>
                        <input type="number" step="any" disabled={loading} value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-sm" placeholder="P" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Potassium (K)</label>
                        <input type="number" step="any" disabled={loading} value={potassium} onChange={(e) => setPotassium(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-sm" placeholder="K" required />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="sm:col-span-2 w-full mt-4 bg-[#1E3F20] text-white font-medium py-3.5 rounded-xl hover:bg-[#2e5931] transition-colors text-sm shadow-sm disabled:opacity-50 cursor-pointer">
                      {loading ? "⏳ Consulting Gemini Telemetry Models..." : "Analyze Metrics with KrishiBodhi AI 🤖"}
                    </button>
                  </form>
                </div>
              ) : records.length === 0 ? (
                /* 🍃 EMPTY STATE COMPONENT */
                <EmptyState onAction={() => setShowForm(true)} />
              ) : selectedRecord ? (
                /* 🖥️ Selected Record Details View */
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Currently Selected Profiling</span>
                      <h2 className="text-xl font-bold text-gray-900 mt-0.5">{selectedRecord.name}</h2>
                      
                      {/* CRUD Control Panel */}
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => openEditModal(selectedRecord)} 
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-xl transition-all font-semibold shadow-sm cursor-pointer"
                        >
                          ✏️ Edit Record
                        </button>
                        <button 
                          onClick={() => handleDeleteRecord(selectedRecord.id)} 
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-xl transition-all font-semibold shadow-sm cursor-pointer"
                        >
                          🗑️ Delete Record
                        </button>
                      </div>
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${selectedRecord.moisture < 30 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {selectedRecord.moisture < 30 ? 'Low Hydration' : 'Optimal'}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                      <p className="text-xs font-semibold text-gray-400">🌡️ Temp</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{selectedRecord.temperature}°C</p>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">Normal Range</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                      <p className="text-xs font-semibold text-gray-400">🌿 N-P-K Status</p>
                      <p className="text-xs font-bold text-gray-800 mt-1">
                        N:{selectedRecord.nitrogen ?? '-'} | P:{selectedRecord.phosphorus ?? '-'} | K:{selectedRecord.potassium ?? '-'}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Monitored</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm text-center">
                      <p className="text-xs font-semibold text-gray-400">📍 Region</p>
                      <p className="text-sm font-bold text-gray-700 mt-1.5">Bhimtal Hub</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🤖</span>
                      <h3 className="font-bold text-[#1E3F20] text-base">KrishiBodhi AI Intelligent Advisory</h3>
                    </div>
                    {renderFormattedAdvisory(selectedRecord.advisory)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal Component */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        record={recordToEdit}
        onSave={handleSaveEditedRecord}
      />

    </div>
  );
}