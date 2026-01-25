'use client';

export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const baseClasses = 'px-6 py-3 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-dark-charcoal text-white hover:bg-[#2d3139]',
    secondary: 'bg-medium-grey text-dark-charcoal hover:bg-[#DCDCDC]',
    danger: 'bg-red text-white hover:bg-[#DC2626]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
