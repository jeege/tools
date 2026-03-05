import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clipboard, Globe, LogOut, Shield, User } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '剪贴板', icon: Clipboard },
    { path: '/tunnel', label: 'Tunnel', icon: Globe, requireAuth: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header - 简洁的顶部栏 */}
      <header className="flex-shrink-0 bg-card border-b safe-area-top">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Tools</span>
          </div>

          {/* Desktop/Tablet 导航 */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.requireAuth && !token) return null;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* 用户操作 */}
          <div className="flex items-center gap-1">
            {token ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - 只在有多个导航项时显示 */}
      {(() => {
        const visibleNavItems = navItems.filter(
          (item) => !(item.requireAuth && !token)
        );
        if (visibleNavItems.length <= 1) return null;
        return (
          <nav className="sm:hidden flex-shrink-0 bg-card border-t safe-area-bottom">
            <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                      active
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        active ? 'bg-primary/10' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        );
      })()}
    </div>
  );
}
