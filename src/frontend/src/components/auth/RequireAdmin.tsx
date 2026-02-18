import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAdminContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Loader2, KeyRound } from 'lucide-react';
import LoginButton from './LoginButton';

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin, refetch } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Show loading state while initializing or checking admin status
  if (isInitializing || (isAuthenticated && checkingAdmin)) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not authenticated - show owner access screen with sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Owner Access Required</CardTitle>
            <CardDescription className="text-base">
              This is the owner dashboard for managing your site's articles. Sign in with Internet Identity to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but not admin - show restricted access message
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <Card className="border-2 border-destructive/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Restricted</CardTitle>
            <CardDescription className="text-base">
              This area is restricted to the site owner. Your account does not have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Authenticated and admin - render children
  return <>{children}</>;
}
