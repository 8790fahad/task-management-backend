import { Elysia } from 'elysia';
import { NotFoundError } from '@application/errors/NotFoundError';
import { ValidationError } from '@application/errors/ValidationError';

export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404;
      return {
        error: 'Not Found',
        message: error.message,
      };
    }

    if (error instanceof ValidationError) {
      set.status = 400;
      return {
        error: 'Validation Error',
        message: error.message,
      };
    }

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        error: 'Validation Error',
        message: error.message,
      };
    }

    console.error('Unhandled error:', error);
    set.status = 500;
    return {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    };
  });


