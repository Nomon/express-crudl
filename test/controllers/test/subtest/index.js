exports.read = function(req, res, next) {
  res.send({"subtest:":"subtest "+req.params.subtest_id});
};

exports.list = function(req, res, next) {
  var err = new Error("subtest-error");
  next(err);
};

exports.error = function(error, req, res, next) {
  res.send(500, {'error':error.message});
};