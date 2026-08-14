import { Shield } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex-shrink-0 bg-card border-b safe-area-top">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Tools</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto">{children}</div>
      </main>
    </div>
  );
}
