import React from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm',
  secondary: 'bg-bg-tertiary text-text-primary border border-border hover:bg-border',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
  danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20',
  outline: 'bg-transparent border border-border text-text-primary hover:border-primary-400 hover:text-primary-500',
  accent: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-3.5 text-base rounded-full font-bold',
  icon: 'p-2.5 rounded-xl',
};

export default function Button({ children, variant = 'primary', size = 'md', className, isLoading = false, icon: Icon, iconRight: IconRight, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer',
        'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant], sizes[size], className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}
