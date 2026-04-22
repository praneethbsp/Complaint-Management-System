const statusMap = {
  PENDING:     { label: 'Pending',      cls: 'badge-pending'  },
  ASSIGNED:    { label: 'Assigned',     cls: 'badge-assigned' },
  IN_PROGRESS: { label: 'In Progress',  cls: 'badge-progress' },
  RESOLVED:    { label: 'Resolved',     cls: 'badge-resolved' },
};

export const Badge = ({ variant, children, className = '' }) => {
  const status = statusMap[variant?.toUpperCase?.()];
  if (status) {
    return <span className={`badge ${status.cls} ${className}`}>{status.label}</span>;
  }

  return (
    <span
      className={`badge ${className}`}
      style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const info = statusMap[status] ?? statusMap.PENDING;
  return <span className={`badge ${info.cls}`}>{info.label}</span>;
};
