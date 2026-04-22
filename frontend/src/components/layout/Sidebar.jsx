import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, Home, PlusCircle, Users, Settings, LogOut, Bell, Briefcase } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { name: 'Overview', path: '/admin', icon: Home, end: true },
          { name: 'Staff', path: '/admin/staff', icon: Users },
          { name: 'Notifications', path: '/admin/notifications', icon: Bell },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'STAFF':
        return [
          { name: 'My Tasks', path: '/staff', icon: Briefcase, end: true },
          { name: 'Notifications', path: '/staff/notifications', icon: Bell },
          { name: 'Settings', path: '/staff/settings', icon: Settings },
        ];
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: Home, end: true },
          { name: 'New Complaint', path: '/complaints/new', icon: PlusCircle },
          { name: 'Notifications', path: '/notifications', icon: Bell },
          { name: 'Settings', path: '/settings', icon: Settings },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          sidebar fixed inset-y-0 left-0 z-30 w-56 flex flex-col
          transform transition-transform duration-200 ease-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div
          className="flex h-14 items-center justify-between px-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-[14px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Campus CMS
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
        {/* Nav Links */}
        <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto">
          <p
            className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} className="shrink-0" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--status-danger)' }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
