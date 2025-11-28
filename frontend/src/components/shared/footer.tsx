interface FooterProps {
  maxWidth?: string;
}

export function Footer({ maxWidth = "max-w-5xl" }: FooterProps) {
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

