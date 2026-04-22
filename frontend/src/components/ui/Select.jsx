import { forwardRef } from 'react';

export const Select = forwardRef(({ label, error, options, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={`input-field cursor-pointer ${error ? '!border-red-500' : ''} ${className}`}
      {...props}
    >
      <option value="" disabled>Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));

Select.displayName = 'Select';
