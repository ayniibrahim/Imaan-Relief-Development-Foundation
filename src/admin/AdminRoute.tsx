import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';

interface AdminRouteProps {
  requiredRoles?: ('super_admin' | 'editor' | 'content_manager')[];
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ requiredRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <LoadingSpinner message="Verifying administrative credentials..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role) && user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#faf9f6]">
        <h2 className="font-serif text-2xl font-bold text-[#ba1a1a]">Access Restricted</h2>
        <p className="mt-2 text-sm text-[#717975] max-w-sm">
          Your account role ({user.role}) is not authorized to access this section.
        </p>
      </div>
    );
  }

  return <Outlet />;
};
