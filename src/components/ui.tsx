import type { ReactNode } from 'react';
import { Link } from './Link';

export function StatusBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    'EVIDENCE_SUPPORTED': { bg: 'bg-forest-100', text: 'text-forest-700', dot: 'bg-forest-500', label: 'Evidence Supported' },
    'SUPERVISOR_VERIFIED': { bg: 'bg-forest-100', text: 'text-forest-700', dot: 'bg-forest-500', label: 'Supervisor Verified' },
    'USER_CONFIRMED': { bg: 'bg-honey-100', text: 'text-honey-800', dot: 'bg-honey-500', label: 'User Confirmed' },
    'SELF_REPORTED': { bg: 'bg-ink-100', text: 'text-ink-600', dot: 'bg-ink-400', label: 'Self Reported' },
    'VERIFIED': { bg: 'bg-forest-100', text: 'text-forest-700', dot: 'bg-forest-500', label: 'Verified' },
    'PENDING': { bg: 'bg-honey-100', text: 'text-honey-800', dot: 'bg-honey-500', label: 'Pending' },
    'PROCESSING': { bg: 'bg-ink-100', text: 'text-ink-600', dot: 'bg-ink-400', label: 'Processing' },
    'REJECTED': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Rejected' },
  };
  const s = map[level] || map['SELF_REPORTED'];
  return (
    <span className={`badge ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function Card({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>{children}</div>;
}

export function StatCard({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string | number; accent?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{label}</p>
          <p className={`stat-num text-2xl mt-1 ${accent || 'text-ink-900'}`}>{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-honey-50 text-honey-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="section-title text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-ink-100 text-ink-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="font-semibold text-ink-700">{title}</p>
      {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };
  const icon = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`${icon[size]} rounded-lg bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5">
          <path d="M12 4c-3 0-5 2-5 4.5 0 .8.2 1.5.6 2.2C6 11.2 5 12.5 5 14c0 2 1.6 3.5 3.5 3.5h7C17.4 17.5 19 16 19 14c0-1.5-1-2.8-2.6-3.3.4-.7.6-1.4.6-2.2C17 6 15 4 12 4z" fill="currentColor"/>
        </svg>
      </div>
      <span className={`font-display font-extrabold tracking-tight text-ink-900 ${sizes[size]}`}>
        HONEY<span className="text-honey-500">CHAIN</span>
      </span>
    </Link>
  );
}

export function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd"/>
    </svg>
  );
}

export function XMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" clipRule="evenodd"/>
    </svg>
  );
}
