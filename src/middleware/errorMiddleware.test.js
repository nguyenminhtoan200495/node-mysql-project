const errorHandler = require('./errorMiddleware');
const { mockRequest, mockResponse, mockNext } = require('../utils/testUtils');

describe('Error Middleware', () => {
  it('should handle errors and log correctly', () => {
    const err = new Error('Test error');
    err.status = 500;

    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Test error' } });
    // Add more expectations for logging if necessary
  });
});
