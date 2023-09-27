const crypto = require('crypto');

exports.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

exports.filterObj = function (obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.sendSuccessResponse = function (
  res,
  data = undefined,
  resultCount = undefined,
  statusCode = 200,
  bodyData = {},
) {
  return res.status(statusCode).send({
    ok: true,
    status: 'success',
    result: resultCount,
    data,
    ...bodyData,
  });
};

exports.getModelName = (Model) => Model?.modelName?.toLowerCase() || 'document';
