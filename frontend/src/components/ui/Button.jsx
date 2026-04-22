import { Loader2 } from 'lucide-react';

const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 outline-none disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary:   'text-white hover:opacity-90 active:scale-[0.98]',
  secondary: 'hover:opacity-80 active:scale-[0.98]',
  ghost:     'active:scale-[0.98]',
  danger:    'text-white active:scale-[0.98]',
  outline:   'active:scale-[0.98]',
};

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-5 text-sm rounded-lg gap-2',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: 'var(--bg)',
    },
    secondary: {
      backgroundColor: 'var(--bg-muted)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      backgroundColor: 'var(--status-danger)',
      color: '#fff',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variantStyles[variant]}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
};
