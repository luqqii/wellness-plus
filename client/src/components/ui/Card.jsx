import React from 'react';
import { cn } from '../../utils/cn';

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 border border-border shadow-sm transition-all duration-200',
        hover && 'hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-base font-bold text-text-primary', className)}>{children}</h3>;
}

export function CardDescription({ children, className }) {
  return <p className={cn('text-sm text-text-secondary', className)}>{children}</p>;
}
