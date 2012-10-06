

exports.name = "test";
exports.subresources = {
  "subtest": require('./subtest')
}

exports.before = function(req, res, next) {

}

exports.create = function(req, res, next) {
  res.send({"test:":"test created"});
}

exports.list = function(req, res, next) {
  res.send({"test:":"tests"});
}

exports.update = function(req, res, next) {
  res.send({"test:":"test "+req.params.test_id});
}

exports.read = function(req, res, next) {
  res.send({"test:":"test "+req.params.test_id});
}

exports.del = function(req, res, next) {
  res.send({"test:":"test "+req.params.test_id+" delete"});
}