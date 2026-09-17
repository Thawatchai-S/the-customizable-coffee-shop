export class AppError extends Error {
  constructor(message, { statusCode = 500, cause } = {}) {
    super(message, { cause });
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, { statusCode: 404 });
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input', issues = []) {
    super(message, { statusCode: 422 });
    this.name = 'ValidationError';
    this.issues = issues;
  }
}
