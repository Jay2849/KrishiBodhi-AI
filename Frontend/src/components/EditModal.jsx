import React, { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, record, onSave }) {
  const [farmerName, setFarmerName] = useState('');
  const [moisture, setMoisture] = useState('');
  const [temp, setTemp] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setFarmerName(record.name || record.farmer_name || '');
      setMoisture(record.moisture !== undefined ? record.moisture : record.soil_moisture || '');
      setTemp(record.temperature !== undefined ? record.temperature : record.temperature || '');
      setNitrogen(record.nitrogen !== undefined ? record.nitrogen : record.nitrogen_level || '');
      setPhosphorus(record.phosphorus !== undefined ? record.phosphorus : record.phosphorus_level || '');
      setPotassium(record.potassium !== undefined ? record.potassium : record.potassium_level || '');
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmerName) {
      alert('Farmer name is required');
      return;
    }
    setSaving(true);
    await onSave(record.id, {
      farmer_name: farmerName,
      soil_moisture: parseFloat(moisture),
      temperature: parseFloat(temp),
      nitrogen_level: nitrogen !== '' ? parseFloat(nitrogen) : undefined,
      phosphorus_level: phosphorus !== '' ? parseFloat(phosphorus) : undefined,
      potassium_level: potassium !== '' ? parseFloat(potassium) : undefined,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">✏️ Edit Field Evaluation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Farmer Full Name</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3F20] text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Soil Moisture (%)</label>
              <input
                type="number"
                step="any"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Temperature (°C)</label>
              <input
                type="number"
                step="any"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Nitrogen (N)</label>
              <input
                type="number"
                step="any"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-xl text-center text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Phosphorus (P)</label>
              <input
                type="number"
                step="any"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-xl text-center text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Potassium (K)</label>
              <input
                type="number"
                step="any"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-xl text-center text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1E3F20] hover:bg-[#2e5931] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
