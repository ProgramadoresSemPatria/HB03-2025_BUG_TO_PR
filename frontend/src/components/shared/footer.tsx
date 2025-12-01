interface FooterProps {
  maxWidth?: string;
  variant?: "default" | "slate";
}

export function Footer({ maxWidth = "max-w-5xl", variant = "default" }: FooterProps) {
  if (variant === "slate") {
    return (
      <footer className="border-t border-slate-900/80 py-8 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className={`w-full ${maxWidth} mx-auto px-6 text-center`}>
          <p className="text-xs text-slate-500 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
            Made for developers, by developers
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border/30 py-8 bg-background">
      <div className={`w-full ${maxWidth} mx-auto px-6 text-center`}>
        <p className="text-sm text-muted-foreground">
          Made for developers, by developers
        </p>
      </div>
    </footer>
  );
}

