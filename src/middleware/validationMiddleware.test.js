const { validateLogin } = require('./validationMiddleware');
const { mockRequest, mockResponse, mockNext } = require('../utils/testUtils');

describe('Validation Middleware', () => {
  it('should pass validation with correct input', () => {
    const req = mockRequest({ body: { username: 'user1', password: 'password123' } });
    const res = mockResponse();
    const next = mockNext();

    validateLogin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should fail validation with missing username', () => {
    const req = mockRequest({ body: { password: 'password123' } });
    const res = mockResponse();
    const next = mockNext();

    validateLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: '"username" is required' });
  });
});
