// File: components/ui/button.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils'; // tu función de unión de clases

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  outline: 'border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
  destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
