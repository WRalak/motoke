'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'dealer' | 'customer' | 'salesperson';
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = <div>Loading...</div> 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = auth.getToken();
        const user = auth.getUser();

        if (!token || !user) {
          router.push('/auth/login');
          return;
        }

        // Check role requirements
        if (requiredRole && user.role !== requiredRole) {
          router.push('/browse');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return fallback;
  }

  if (!isAuthorized) {
    return fallback;
  }

  return <>{children}</>;
}

// Hook for checking authentication
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    const userData = auth.getUser();
    
    setUser(userData);
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const session = await auth.login(credentials);
      setUser(session.user);
      return session;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}
