# express-crudl

## About

Motivation for the module is to provide simple and consistent structure to controllers handling CREATE, READ, UPDATE, DELETE
and LIST operations to resources and their subresources.

[![Build Status](https://secure.travis-ci.org/Nomon/express-crudl.png)](http://travis-ci.org/Nomon/express-crudl)


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
        return next(error || new Error("test "+req.params.test_id+" not found"));
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

For an example directory structure for controllers see test/controllers

## Api
Only has the one method for loading and mounting the routes, express-crudl(app, options);

options available are:
verbose
controller_path

### Functions in controllers

### .before(req, res, next)

  Middleware that is executed before the routes and before subresources.


### .create(req, res, next)

  The function executed for CREATE operation, ie POST /name

### .read(req, res, next)

  The function executed for READ operation, ie GET /name/:name_id

### .update(req, res, next)

  The function executed for UPDATE operation, ie PUT /name/:name_id

### .del(req, res, next)

  The function executed for DELETE operation, ie DELETE /name/:name_id

### .list(req, res, next)

  The function executed for LIST operation, ie GET /name

### Variables in controllers

### .subresources

  Object mapping the subresources in name:module pairs {'name': require('./name')}

### .prefix

  prefix this controller under this path, exports.prefix = '/resource'; exports.name = 'sub';
  maps the controller to '/resource/:resource_id/sub';

### .name

  overrides the name of the controller, by default the file/directory name is used.



## Notes

  Inspired by [express-mvc](https://github.com/visionmedia/express/tree/master/examples/mvc)
