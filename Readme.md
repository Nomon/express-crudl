# express-crudl

## About

Motivation for the module is to provide simple and consistent structure to controllers handling CREATE, READ, UPDATE, DELETE
and LIST operations to resources and their subresources.

![Build Status](https://secure.travis-ci.org/Nomon/express-crudl.png)](http://travis-ci.org/Nomon/express-crudl)


## Example controller

```js

exports.name = "test";
exports.subresources = {
    'subroute': require('./subroute');
}

exports.before = function(req, res, next) {
  if(req.params.test_id) {
    Tests.load(req.params.test_id, function(error, test) {
      if(test) {
        req.test = test;
        return next();
      } else {
        return next(new Error("test "+req.params.test_id+" not found"));
      }
    });
  } else {
    return next();
  }
};

exports.read = function(req, res, next) {
  res.send(req.test);
};

exports.create = function(req, res, next) {
  Tests.create(req.body, function(err, test) {
    if(err) {
      return next(err);
    } else {
      res.send(test);
    }
  });
};
```

And to use the controllers:

```js
var express = require('express')
  , express-crudl = require('express-crudl');

var app = express();
app.set('controller path', __dirname + '/controllers/');
// Will mount all the controllers to app and print the routes with verbose:true
express-crudl(app, {verbose: true});
console.log(app.controllers);

```

## Api
Only has the one method for loading and mounting the routes, express-crudl(app, options);

options available are:
verbose
controller_path

## Notes

  Inspired by [express-mvc](https://github.com/visionmedia/express/tree/master/examples/mvc)
