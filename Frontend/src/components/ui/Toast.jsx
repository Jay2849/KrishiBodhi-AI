import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.message - Toast notification content
 * @param {'success' | 'error' | 'info'} [props.type='info'] - Notification type
 * @param {boolean} props.isVisible - Controls visibility state
 * @param {() => void} props.onClose - Function callback to close toast
 */
export default function Toast({ message, type = 'info', isVisible, onClose }) {
  if (!isVisible) return null;

  const types = {
    success: "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    error: "bg-rose-50 border-rose-500 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    info: "bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm animate-bounce ${types[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-xs font-bold hover:opacity-70 ml-2">✕</button>
    </div>
  );
}