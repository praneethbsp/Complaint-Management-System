export const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-b ${className}`} style={{ borderColor: 'var(--border)' }}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div
    className={`px-5 py-3 border-t rounded-b-xl ${className}`}
    style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}
  >
    {children}
  </div>
);
