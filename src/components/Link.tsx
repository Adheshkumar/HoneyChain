export function Link({ to, children, className = '', onClick }: { to: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
