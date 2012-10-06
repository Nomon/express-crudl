var crud = require('../');
var express = require('express');
var assert = require('chai').assert;
var http = require('http');
var request = require('superagent');

function makeapp () {
  var app = express();
  app.set('controller path', __dirname + '/controllers');
  return app;
}

describe('express-crud', function() {
  var app, server, address;
  before(function(done) {
    app = makeapp();
    server = http.Server(app);
    server.listen(0, function () {
      address = server.address();
      done();
    });
  });
  after(function(done) {
    server.close(done);
  });

  describe('.controllers', function() {
    it('should contain all the correct controllers', function() {
      app.set('controller path', __dirname + '/controllers/');
      crud(app,{verbose:false});
      assert.isNotNull(app.controllers, 'Crud adds controllers to applications');
      assert.isNotNull(app.controllers['test'], 'Crud adds controllers to applications');
      assert.isNotNull(app.controllers['subtest'], 'Crud adds controllers to applications');
    });
  });
  describe('routes', function() {
    it('should route requests to correct routes', function(done) {
      var expected = {
        'GET /test':{"test:":"tests"},
        'POST /test':{"test:":"test created"},
        'PUT /test/1':{"test:":"test 1"},
        'GET /test/1':{"test:":"test 1"},
        'DEL /test/1':{"test:":"test 1 delete"},
        'GET /test/1/subtest/1': {"subtest:":"subtest 1"}
      };
      var numRoutes = Object.keys(expected).length;
      Object.keys(expected).forEach(function(key) {
        var parts = key.split(' ');
        var method = parts[0];
        var path = parts[1];
        var result = expected[key];
        var url = 'http://' + address.address + ':' + address.port + path;
        request[method.toLowerCase()](url, function(error, res) {
          res.req.method = res.req.method == 'DELETE' ? 'DEL' : res.req.method;
          assert.deepEqual(JSON.parse(res.text), expected[res.req.method + ' '+res.req.path]);
          --numRoutes || done();
        });
      });
    });
  });
});