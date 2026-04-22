// Request validation and sanitization utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  enum?: string[];
  sanitize?: boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    sanitize: true
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    sanitize: true
  },
  phone: {
    required: false,
    pattern: /^\+?[1-9]\d{1,14}$/,
    maxLength: 20,
    sanitize: true
  },
  id: {
    required: true,
    pattern: /^[a-zA-Z0-9_-]+$/,
    maxLength: 100
  }
};

// Vehicle validation rules
export const vehicleRules = {
  make: { required: true, minLength: 2, maxLength: 50, sanitize: true },
  model: { required: true, minLength: 1, maxLength: 50, sanitize: true },
  year: { required: true, min: 1900, max: new Date().getFullYear() + 1 },
  mileage: { required: true, min: 0, max: 1000000 },
  price: { required: true, min: 0, max: 100000000 },
  vin: { required: true, pattern: /^[A-HJ-NPR-Z0-9]{17}$/, maxLength: 17 },
  colour: { required: true, minLength: 2, maxLength: 50, sanitize: true },
  county: { required: true, minLength: 2, maxLength: 50, sanitize: true },
  description: { required: true, minLength: 10, maxLength: 2000, sanitize: true }
};

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JS URLs
    .replace(/on\w+=/gi, '') // Remove potential event handlers
    .substring(0, 1000); // Limit length
}

export function sanitizeNumber(input: any): number | null {
  const num = Number(input);
  return isNaN(num) ? null : num;
}

// Validation functions
export function validateField(value: any, rule: ValidationRule): { valid: boolean; error?: string } {
  // Check if required
  if (rule.required && (value === undefined || value === null || value === '')) {
    return { valid: false, error: 'This field is required' };
  }

  // Skip validation if not required and empty
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return { valid: true };
  }

  // Type-specific validation
  if (typeof value === 'string') {
    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      return { valid: false, error: `Minimum length is ${rule.minLength}` };
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return { valid: false, error: `Maximum length is ${rule.maxLength}` };
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, error: 'Invalid format' };
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      return { valid: false, error: `Must be one of: ${rule.enum.join(', ')}` };
    }
  }

  // Number validation
  if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return { valid: false, error: `Minimum value is ${rule.min}` };
    }
    if (rule.max !== undefined && value > rule.max) {
      return { valid: false, error: `Maximum value is ${rule.max}` };
    }
  }

  return { valid: true };
}

export function validateObject(data: any, schema: ValidationSchema): { valid: boolean; errors: { [key: string]: string } } {
  const errors: { [key: string]: string } = {};

  for (const [field, rule] of Object.entries(schema)) {
    let value = data[field];

    // Sanitize if required
    if (rule.sanitize && typeof value === 'string') {
      value = sanitizeString(value);
      data[field] = value;
    }

    const validation = validateField(value, rule);
    if (!validation.valid) {
      errors[field] = validation.error || 'Invalid value';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Request validation middleware
export function validateRequest(schema: ValidationSchema) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      const validation = validateObject(body, schema);
      
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          message: 'Validation failed'
        };
      }

      return { success: true, data: body };
    } catch (error) {
      return {
        success: false,
        errors: {},
        message: 'Invalid JSON format'
      };
    }
  };
}

// Pagination validation
export function validatePagination(page?: string, limit?: string) {
  const pageNum = Math.max(1, parseInt(page || '1'));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20')));
  
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
}

// Search parameter validation
export function validateSearchParams(searchParams: URLSearchParams) {
  const search = searchParams.get('search')?.trim();
  const make = searchParams.get('make')?.trim();
  const status = searchParams.get('status')?.trim();
  const county = searchParams.get('county')?.trim();
  
  // Validate and sanitize search parameters
  const validated: any = {
    search: search ? sanitizeString(search) : undefined,
    make: make ? sanitizeString(make) : undefined,
    status: status && ['available', 'pending', 'sold', 'all'].includes(status) ? status : 'available',
    county: county ? sanitizeString(county) : undefined
  };

  // Price range validation
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  if (minPrice || maxPrice) {
    const min = minPrice ? Math.max(0, parseInt(minPrice)) : undefined;
    const max = maxPrice ? Math.min(100000000, parseInt(maxPrice)) : undefined;
    
    if (min !== undefined && max !== undefined && min > max) {
      // Swap if min > max
      validated.minPrice = max;
      validated.maxPrice = min;
    } else {
      validated.minPrice = min;
      validated.maxPrice = max;
    }
  }

  return validated;
}
