

exports.name = "test";
exports.subresources = {
  "subtest": require('./subtest')
};

exports.options = {
  'jsonp callback': true
};

exports.before = function(req, res, next) {
  next();
};

exports.create = function(req, res) {
  res.send({"test:":"test created"});
};

exports.list = function(req, res) {
  res.send({"test:":"tests"});
};

exports.update = function(req, res) {
  res.send({"test:":"test "+req.params.test_id});
};

exports.read = function(req, res) {
  res.send({"test:":"test "+req.params.test_id});
};

exports.del = function(req, res) {
  res.send({"test:":"test "+req.params.test_id+" delete"});
};