// Enhanced logging utility for production monitoring

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context, userId, requestId, ip } = entry;
    
    let formatted = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (userId) formatted += ` [User:${userId}]`;
    if (requestId) formatted += ` [Req:${requestId}]`;
    if (ip) formatted += ` [IP:${ip}]`;
    
    formatted += `: ${message}`;
    
    if (context) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (entry.stack) {
      formatted += `\nStack: ${entry.stack}`;
    }
    
    return formatted;
  }

  private createEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stack: level === LogLevel.ERROR || level === LogLevel.FATAL ? new Error().stack : undefined
    };
  }

  private log(entry: LogEntry): void {
    const formatted = this.formatMessage(entry);
    
    if (this.isDevelopment) {
      // Development: log to console with colors
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
          console.error(formatted);
          break;
        case LogLevel.FATAL:
          console.error(formatted);
          break;
        default:
          console.log(formatted);
      }
    } else {
      // Production: send to logging service
      this.sendToLoggingService(entry);
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    try {
      // In production, send to logging service (e.g., Sentry, LogRocket, custom endpoint)
      // For now, just log to console with error level
      if (entry.level === LogLevel.ERROR || entry.level === LogLevel.FATAL) {
        console.error('PRODUCTION ERROR:', this.formatMessage(entry));
      }
    } catch (error) {
      console.error('Failed to send to logging service:', error);
    }
  }

  debug(message: string, context?: any): void {
    this.log(this.createEntry(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: any): void {
    this.log(this.createEntry(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: any): void {
    this.log(this.createEntry(LogLevel.WARN, message, context));
  }

  error(message: string, context?: any): void {
    this.log(this.createEntry(LogLevel.ERROR, message, context));
  }

  fatal(message: string, context?: any): void {
    this.log(this.createEntry(LogLevel.FATAL, message, context));
  }

  // API request logging
  logApiRequest(method: string, url: string, userId?: string, requestId?: string, ip?: string): void {
    this.info(`API Request: ${method} ${url}`, {
      method,
      url,
      userId,
      requestId,
      ip,
      timestamp: new Date().toISOString()
    });
  }

  logApiResponse(method: string, url: string, statusCode: number, duration: number, userId?: string, requestId?: string): void {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log(this.createEntry(level, `API Response: ${method} ${url} - ${statusCode} (${duration}ms)`), {
      method,
      url,
      statusCode,
      duration,
      userId,
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Database operation logging
  logDatabaseQuery(operation: string, table: string, duration: number, error?: any): void {
    const level = error ? LogLevel.ERROR : LogLevel.DEBUG;
    const message = error 
      ? `DB Error: ${operation} on ${table} (${duration}ms)`
      : `DB Query: ${operation} on ${table} (${duration}ms)`;
    
    this.log(this.createEntry(level, message, error ? { error } : {
      operation,
      table,
      duration
    }));
  }

  // Security event logging
  logSecurityEvent(event: string, userId?: string, ip?: string, context?: any): void {
    this.warn(`Security Event: ${event}`, {
      event,
      userId,
      ip,
      timestamp: new Date().toISOString(),
      ...context
    });
  }

  // Performance logging
  logPerformance(operation: string, duration: number, metadata?: any): void {
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.INFO;
    this.log(this.createEntry(level, `Performance: ${operation} took ${duration}ms`), {
      operation,
      duration,
      ...metadata
    });
  }
}

// Create singleton logger instance
export const logger = new Logger();

// Request context for logging
export interface RequestContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
}

// Helper function to extract request context
export function getRequestContext(request: Request): RequestContext {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent');
  
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  return {
    ip,
    userAgent: userAgent || 'unknown'
  };
}

// Performance monitoring
export class PerformanceMonitor {
  private operations = new Map<string, number>();

  start(operation: string): void {
    this.operations.set(operation, Date.now());
  }

  end(operation: string): number {
    const startTime = this.operations.get(operation);
    if (!startTime) {
      logger.warn(`Performance: Operation '${operation}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.operations.delete(operation);
    
    logger.logPerformance(operation, duration);
    return duration;
  }

  // Decorator for measuring function performance
  measure<T extends (...args: any[]) => any>(
    operation: string,
    fn: T
  ): T {
    return ((...args: any[]) => {
      const start = Date.now();
      try {
        const result = fn(...args);
        const duration = Date.now() - start;
        logger.logPerformance(operation, duration);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        logger.logPerformance(`${operation} (failed)`, duration, { error });
        throw error;
      }
    }) as T;
  }
}

export const performanceMonitor = new PerformanceMonitor();
