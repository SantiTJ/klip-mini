// File: components/ui/button.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'destructive' | 'link';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tipo de botón (color/estilo) */
  variant?: Variant;
  /** Tamaño del botón */
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  outline: 'border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
  destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  link: 'text-blue-600 hover:underline focus:ring-blue-500',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
