import React from 'react';

export default function EmptyState({ onAction }) {
  return (
    <div className="bg-white p-12 rounded-3xl border border-dashed border-emerald-200 text-center shadow-sm space-y-5 animate-fadeIn my-4">
      <div className="w-20 h-20 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-inner">
        🌱
      </div>
      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-xl font-bold text-gray-900">No Field Evaluations Recorded</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          There are currently no telemetry records registered for this supervisor profile in the KrishiBodhi database matrix.
        </p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-[#1E3F20] hover:bg-[#2e5931] text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          ➕ Record First Field Evaluation
        </button>
      )}
    </div>
  );
}
