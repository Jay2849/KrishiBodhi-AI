import React from 'react';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls if the modal modal layer overlay shows
 * @param {() => void} props.onClose - Triggers close routine callback
 * @param {string} props.title - Structural heading string
 * @param {React.ReactNode} props.children - Enclosed sub-dom components
 */
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-medium">✕</button>
        </div>
        <div className="mt-4 text-slate-600 dark:text-slate-300 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}