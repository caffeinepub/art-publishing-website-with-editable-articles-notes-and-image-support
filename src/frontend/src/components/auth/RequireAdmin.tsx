import { useAdminSession } from '../../hooks/useAdminSession';
import AdminLoginForm from './AdminLoginForm';

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { isAuthenticated } = useAdminSession();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return <>{children}</>;
}
