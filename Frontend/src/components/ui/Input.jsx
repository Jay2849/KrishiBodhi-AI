import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.label - Input field label
 * @param {string} [props.error] - Error message to display
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Extra standard input attributes
 */
export default function Input({ label, error, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
      <input 
        className={`w-full px-3 py-2 border rounded-lg outline-none transition-all duration-150 text-slate-900 bg-white dark:bg-slate-800 dark:text-slate-100 ${
          error 
            ? 'border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900' 
            : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-900'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 mt-0.5">{error}</span>}
    </div>
  );
}