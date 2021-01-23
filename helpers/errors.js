const { ERROR_NOT_FOUND,
  ERROR_INVALID_ID,
  ERROR_SERVER } = require('../utils/constants');

function serverErrorNotification(res, err, notification) {
  return res.status(ERROR_SERVER).send({ message: notification });
}

function invalidDataNotification(res, err, notification) {
  return res.status(ERROR_INVALID_ID).send({ message: notification });
}

function nonExistentDataNotification(res, err, notification) {
  return res.status(ERROR_NOT_FOUND).send({ message: notification })
}

function createNotFoundError() {
  const err = new Error();
  err.statusCode = ERROR_NOT_FOUND;
  throw err;
}

module.exports = {
  serverErrorNotification,
  invalidDataNotification,
  nonExistentDataNotification,
  createNotFoundError
}