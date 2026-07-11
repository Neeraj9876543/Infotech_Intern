const responseHandler = require('../utils/responseHandler');

const notFound = (req, res) => {
  return responseHandler(res, 404, false, `Route ${req.originalUrl} not found`);
};

module.exports = notFound;
