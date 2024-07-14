const mockRequest = (sessionData, body, headers, params) => ({
  session: { data: sessionData },
  body,
  headers,
  params
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn((statusCode) => {
    res.statusCode = statusCode;
    return res;
  });
  res.send = jest.fn((message) => {
    res.message = message;
    return res;
  });
  res.json = jest.fn().mockReturnValue(res); // Mock cho phương thức json
  return res;
};

const mockNext = () => {
  let called = false;
  return () => {
    called = true;
  };
};

module.exports = {
  mockRequest,
  mockResponse,
  mockNext
};
