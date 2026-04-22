import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar flex h-14 shrink-0 items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 lg:hidden transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Menu size={18} />
        </button>
        <span className="hidden sm:block text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Welcome, <span style={{ color: 'var(--text)', fontWeight: 600 }}>{user?.name}</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Separator */}
        <div className="mx-1.5 h-5 w-px" style={{ background: 'var(--border)' }} />

        {/* User */}
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-medium leading-none" style={{ color: 'var(--text)' }}>{user?.name}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
