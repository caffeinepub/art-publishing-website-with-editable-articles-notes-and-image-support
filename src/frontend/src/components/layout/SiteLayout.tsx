import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAdminSession } from '../../hooks/useAdminSession';
import { Settings, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { isAuthenticated, logout } = useAdminSession();
  const queryClient = useQueryClient();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/assets/generated/site-logo.dim_512x512.png"
                alt="Site logo"
                className="w-10 h-10"
              />
              <span className="text-xl font-light tracking-tight">My Collection</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link to="/articles">
                <Button
                  variant="ghost"
                  className={currentPath.startsWith('/articles') ? 'bg-accent' : ''}
                >
                  Articles
                </Button>
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/admin">
                    <Button
                      variant="ghost"
                      className={currentPath.startsWith('/admin') ? 'bg-accent' : ''}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">{children}</main>

      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} My Collection. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
