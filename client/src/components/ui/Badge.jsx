import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({ children, variant = 'default', size = 'md', dot = false, className }) {
  const variants = {
    default: 'bg-bg-tertiary text-text-secondary',
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
    accent: 'bg-orange-50 text-orange-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold rounded-full', variants[variant], sizes[size], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'success' ? 'bg-green-500' : variant === 'primary' ? 'bg-primary-500' : 'bg-text-muted')} />}
      {children}
    </span>
  );
}
