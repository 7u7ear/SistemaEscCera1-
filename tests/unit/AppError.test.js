/**
 * Unit tests for AppError shared class.
 * These tests verify that operational errors are properly constructed.
 */
const AppError = require('../../src/shared/errors/AppError');

describe('AppError', () => {
  it('should create an error with the given message and status', () => {
    const error = new AppError('Recurso no encontrado', 404);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Recurso no encontrado');
    expect(error.status).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('should default to status 500 if none provided', () => {
    const error = new AppError('Internal issue');
    expect(error.status).toBe(500);
  });

  it('should capture a stack trace', () => {
    const error = new AppError('Test error', 400);
    expect(error.stack).toBeDefined();
  });
});
