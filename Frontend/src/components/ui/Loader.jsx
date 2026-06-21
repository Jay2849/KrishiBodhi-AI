import React from 'react';

/**
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size of the spinner
 * @param {string} [props.text] - Optional loading text below spinner
 */
export default function Loader({ size = 'md', text }) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className={`${sizes[size]} border-emerald-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
}