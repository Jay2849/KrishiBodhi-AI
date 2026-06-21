import React from 'react';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button text or elements
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - Visual style variant
 * @param {boolean} [props.isLoading=false] - Shows loader if true
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Extra standard button attributes
 */
export default function Button({ children, variant = 'primary', isLoading, ...props }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    danger: "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} disabled={isLoading} {...props}>
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}