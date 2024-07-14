const { mockRequest, mockResponse, mockNext } = require('../utils/testUtils');
const {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin
} = require('../middleware/authJwt');
const db = require('../models');
const User = db.user;

jest.mock('jsonwebtoken');
jest.mock('../models', () => {
  return {
    user: {
      findByPk: jest.fn()
    }
  };
});

describe('Auth Middleware', () => {
  describe('verifyToken', () => {
    // ... (Các bài kiểm tra trước đó đã được cung cấp)

    it('should call next if user is found', async () => {
      const req = mockRequest({}, {}, { 'x-access-token': 'validToken' });
      const res = mockResponse();
      const next = mockNext();

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      User.findByPk.mockResolvedValue({
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com'
      });

      await verifyToken(req, res, next);

      expect(req.userId).toBe(1);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if user cannot be found', async () => {
      const req = mockRequest({}, {}, { 'x-access-token': 'validToken' });
      const res = mockResponse();
      const next = mockNext();

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      User.findByPk.mockRejectedValue(new Error('User not found'));

      await verifyToken(req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res.message).toBe('Unable to verify user');
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe('isAdmin', () => {
    // ... (Các bài kiểm tra trước đó đã được cung cấp)

    it('should call next if user is admin and moderator', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest
          .fn()
          .mockResolvedValue([{ name: 'admin' }, { name: 'moderator' }])
      });

      await isAdmin(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 403 if user is only moderator', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([{ name: 'moderator' }])
      });

      await isAdmin(req, res, next);

      expect(res.statusCode).toBe(403);
      expect(res.message).toBe('Require Admin Role!');
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe('isModerator', () => {
    // ... (Các bài kiểm tra trước đó đã được cung cấp)

    it('should call next if user is admin and moderator', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest
          .fn()
          .mockResolvedValue([{ name: 'admin' }, { name: 'moderator' }])
      });

      await isModerator(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 403 if user is only admin', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([{ name: 'admin' }])
      });

      await isModerator(req, res, next);

      expect(res.statusCode).toBe(403);
      expect(res.message).toBe('Require Moderator Role!');
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe('isModeratorOrAdmin', () => {
    it('should call next if user is admin', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([{ name: 'admin' }])
      });

      await isModeratorOrAdmin(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should call next if user is moderator', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([{ name: 'moderator' }])
      });

      await isModeratorOrAdmin(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 403 if user is not admin or moderator', async () => {
      const req = mockRequest({}, {}, {}, { userId: 1 });
      const res = mockResponse();
      const next = mockNext();

      User.findByPk.mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([{ name: 'user' }])
      });

      await isModeratorOrAdmin(req, res, next);

      expect(res.statusCode).toBe(403);
      expect(res.message).toBe('Require Moderator or Admin Role!');
      expect(next).toHaveBeenCalledTimes(0);
    });
  });
});
