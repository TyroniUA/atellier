import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline';
};

export function Button({ children, className = '', variant = 'default', ...props }: ButtonProps) {
  const variantClassName =
    variant === 'ghost'
      ? 'bg-transparent'
      : variant === 'outline'
        ? 'border bg-transparent'
        : '';

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors focus:outline-none ${variantClassName} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
