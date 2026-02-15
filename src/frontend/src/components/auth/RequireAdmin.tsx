import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAdminContent';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  if (isInitializing || checkingAdmin) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Owner Access Only</AlertTitle>
          <AlertDescription>
            This area is restricted to the site owner. Only the owner can publish and manage articles.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
