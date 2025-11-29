interface FooterProps {
  maxWidth?: string;
  variant?: "default" | "slate";
}

export function Footer({ maxWidth = "max-w-5xl", variant = "default" }: FooterProps) {
  if (variant === "slate") {
    return (
      <footer className="border-t border-slate-800/50 py-8 bg-slate-950/50 backdrop-blur-lg">
        <div className={`w-full ${maxWidth} mx-auto px-6 text-center`}>
          <p className="text-sm text-slate-400">
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

