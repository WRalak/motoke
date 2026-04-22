// Authentication configuration and utilities

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dealer' | 'customer' | 'salesperson';
  status: 'active' | 'inactive' | 'suspended';
  profile: {
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'admin')[];
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  role: 'customer' | 'dealer';
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'admin'] },
    { resource: 'vehicles', actions: ['create', 'read', 'update', 'delete', 'admin'] },
    { resource: 'dealers', actions: ['create', 'read', 'update', 'delete', 'admin'] },
    { resource: 'auctions', actions: ['create', 'read', 'update', 'delete', 'admin'] },
    { resource: 'sales', actions: ['create', 'read', 'update', 'delete', 'admin'] },
    { resource: 'analytics', actions: ['read', 'admin'] },
    { resource: 'settings', actions: ['read', 'update', 'admin'] }
  ],
  dealer: [
    { resource: 'vehicles', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'auctions', actions: ['read', 'create'] },
    { resource: 'sales', actions: ['read', 'create'] },
    { resource: 'profile', actions: ['read', 'update'] }
  ],
  customer: [
    { resource: 'vehicles', actions: ['read'] },
    { resource: 'auctions', actions: ['read'] },
    { resource: 'profile', actions: ['read', 'update'] },
    { resource: 'favorites', actions: ['create', 'read', 'delete'] }
  ],
  salesperson: [
    { resource: 'vehicles', actions: ['read'] },
    { resource: 'customers', actions: ['read', 'create'] },
    { resource: 'sales', actions: ['read', 'create'] },
    { resource: 'leads', actions: ['read', 'create', 'update'] },
    { resource: 'profile', actions: ['read', 'update'] }
  ]
};

// Mock users for development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@motoke.com',
    name: 'System Administrator',
    role: 'admin',
    status: 'active',
    profile: {
      avatar: '/images/avatars/admin.jpg',
      phone: '(555) 000-0001',
      address: '123 Admin Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    permissions: ROLE_PERMISSIONS.admin,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2024-01-20'),
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true
  },
  {
    id: '2',
    email: 'dealer@premiummotors.com',
    name: 'John Dealer',
    role: 'dealer',
    status: 'active',
    profile: {
      avatar: '/images/avatars/dealer.jpg',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    permissions: ROLE_PERMISSIONS.dealer,
    createdAt: new Date('2023-06-15'),
    lastLogin: new Date('2024-01-19'),
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false
  },
  {
    id: '3',
    email: 'customer@email.com',
    name: 'Jane Customer',
    role: 'customer',
    status: 'active',
    profile: {
      avatar: '/images/avatars/customer.jpg',
      phone: '(555) 987-6543',
      address: '456 Oak Avenue',
      city: 'Burbank',
      state: 'CA',
      zipCode: '91502'
    },
    permissions: ROLE_PERMISSIONS.customer,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-20'),
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false
  }
];

// Authentication utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const hasPermission = (user: User, resource: string, action: string): boolean => {
  const permission = user.permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action as any) : false;
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;
  
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (publicRoutes.includes(route)) return true;
  
  const roleRoutes: Record<string, string[]> = {
    admin: ['/admin', '/dashboard', '/vehicles', '/dealers', '/auctions', '/sales', '/analytics', '/settings'],
    dealer: ['/dealer', '/dashboard', '/vehicles', '/auctions', '/sales', '/profile'],
    customer: ['/browse', '/vehicles', '/auctions', '/favorites', '/profile'],
    salesperson: ['/sales', '/dashboard', '/customers', '/leads', '/vehicles', '/profile']
  };
  
  const allowedRoutes = roleRoutes[user.role] || [];
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true;
  }
};

export const refreshAuthToken = async (refreshToken: string): Promise<string> => {
  // In a real app, this would call your auth API
  // For now, return a mock token
  return 'mock-refreshed-token';
};

// Error codes
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_RESET_TOKEN: 'INVALID_RESET_TOKEN',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  INVALID_TWO_FACTOR: 'INVALID_TWO_FACTOR'
} as const;

// Error messages
export const getAuthErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    [AUTH_ERRORS.INVALID_CREDENTIALS]: 'Invalid email or password',
    [AUTH_ERRORS.USER_NOT_FOUND]: 'User not found',
    [AUTH_ERRORS.EMAIL_NOT_VERIFIED]: 'Please verify your email address',
    [AUTH_ERRORS.ACCOUNT_SUSPENDED]: 'Your account has been suspended',
    [AUTH_ERRORS.INVALID_TOKEN]: 'Invalid authentication token',
    [AUTH_ERRORS.TOKEN_EXPIRED]: 'Your session has expired, please log in again',
    [AUTH_ERRORS.WEAK_PASSWORD]: 'Password does not meet security requirements',
    [AUTH_ERRORS.EMAIL_EXISTS]: 'An account with this email already exists',
    [AUTH_ERRORS.INVALID_RESET_TOKEN]: 'Invalid or expired reset token',
    [AUTH_ERRORS.TWO_FACTOR_REQUIRED]: 'Two-factor authentication is required',
    [AUTH_ERRORS.INVALID_TWO_FACTOR]: 'Invalid two-factor authentication code'
  };
  
  return messages[code] || 'An unknown error occurred';
};
