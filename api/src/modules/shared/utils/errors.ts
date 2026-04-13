export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string = "APP_ERROR") {
    super(message);
    this.status = status;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, 404, code);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation error", code?: string) {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", code?: string) {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", code?: string) {
    super(message, 403, code);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", code?: string) {
    super(message, 500, code);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", code?: string) {
    super(message, 400, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict error", code?: string) {
    super(message, 409, code);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service unavailable", code?: string) {
    super(message, 503, code);
  }
}