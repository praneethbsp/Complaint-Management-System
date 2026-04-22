import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label
        className="block text-[13px] font-medium mb-1.5"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={`input-field ${icon ? 'pl-9' : ''} ${error ? '!border-red-500' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
));

Input.displayName = 'Input';
