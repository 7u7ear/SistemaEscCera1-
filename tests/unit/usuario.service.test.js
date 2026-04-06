/**
 * Unit tests for UsuarioService authentication logic.
 * The DB module is mocked so these run without a real database.
 */
const AppError = require('../../src/shared/errors/AppError');

// --- Mocks ---
jest.mock('../../src/api/repositories/usuario.repository', () => ({
  findByUsername: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const UsuarioRepository = require('../../src/api/repositories/usuario.repository');
const bcrypt = require('bcrypt');
const UsuarioService = require('../../src/api/services/usuario.service');

describe('UsuarioService.authenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw 401 if user does not exist', async () => {
    UsuarioRepository.findByUsername.mockResolvedValue(null);
    await expect(UsuarioService.authenticate('nobody', '1234')).rejects.toThrow(AppError);
    await expect(UsuarioService.authenticate('nobody', '1234')).rejects.toMatchObject({
      status: 401,
    });
  });

  it('should throw 403 if user is not active', async () => {
    UsuarioRepository.findByUsername.mockResolvedValue({ username: 'test', estado: 'inactivo', password: 'hash' });
    await expect(UsuarioService.authenticate('test', '1234')).rejects.toMatchObject({ status: 403 });
  });

  it('should throw 401 if password does not match', async () => {
    UsuarioRepository.findByUsername.mockResolvedValue({ username: 'test', estado: 'activo', password: 'hash' });
    bcrypt.compare.mockResolvedValue(false);
    await expect(UsuarioService.authenticate('test', 'wrong')).rejects.toMatchObject({ status: 401 });
  });

  it('should return user without password on success', async () => {
    const fakeUser = { id: 1, username: 'admin', estado: 'activo', password: 'hash', nombre: 'Admin' };
    UsuarioRepository.findByUsername.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await UsuarioService.authenticate('admin', 'correct');
    expect(result).not.toHaveProperty('password');
    expect(result.username).toBe('admin');
  });
});
