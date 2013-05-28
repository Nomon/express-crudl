/*!
  * express-crudl
  */

/**
 * Module dependencies
 */
var express = require('express')
  , fs = require('fs');

/**
 * Express application that we mount and read settings from.
 *
 * @param {Object} parent Express.js application
 * @param {Object} options options
 * @api public
 */
module.exports = function crud(parent, options) {
  options = options || {};
  var verbose = options.verbose || false;
  var controllerPath = options.controller_path || parent.set('controller path') || process.cwd() + '/controllers/';

  fs.readdirSync(controllerPath).forEach(function(name) {
    verbose && console.log('\n   %s:', name);
    var obj = require(controllerPath + name);

    function setupRoutes(obj) {
      var contollerName = obj.name || name
        , prefix = obj.prefix || ''
        , app = express()
        , method
        , path;
      // before middleware support
      prefix = prefix || '';

      if (obj.before) {
        app.param(contollerName + '_id', obj.before);
        verbose && console.log('     PARAM %s -> before', contollerName + '_id');
      }

      if(obj.options) {
        Object.keys(obj.options).forEach(function(key){
          if(obj.options[key] === true) {
            app.enable(key);
          } else if(obj.options[key] === false) {
            app.disable(key);
          } else {
            app.set(key, obj.options[key]);
          }
        });
      }
      // generate routes based
      // on the exported methods

      for (var key in obj) {
        // "reserved" exports
        if (~['name', 'prefix', 'before', 'subresources', 'error', 'options'].indexOf(key)) continue;
        // route exports
        switch (key) {
          case 'read':
            method = 'get';
            path = '/' + contollerName + '/:' + contollerName + '_id';
            break;
          case 'list':
            method = 'get';
            path = '/' + contollerName;
            break;
          case 'update':
            method = 'put';
            path = '/' + contollerName + '/:' + contollerName + '_id';
            break;
          case 'create':
            method = 'post';
            path = '/' + contollerName + '';
            break;
          case 'del':
            method = 'del';
            path = '/' + contollerName + '/:' + contollerName + '_id';
            break;
          default:
            throw new Error('unrecognized route: ' + contollerName + '.' + key);
        }
        path = prefix + path;
        app[method](path, obj[key]);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
      }

      if(obj.error) {
        app.use(obj.error);
        verbose && console.log('     ERRORS -> error');
      }

      if(obj.subresources) {
        verbose && console.log('  subresources');
        Object.keys(obj.subresources).forEach(function(resource) {
          obj.subresources[resource].prefix = obj.subresources[resource].prefix || '/'+contollerName+'/:'+contollerName+'_id';
          obj.subresources[resource].name = obj.subresources[resource].name || resource;
          setupRoutes(obj.subresources[resource]);
        });
      }
      parent.controllers = parent.controllers || {};
      parent.controllers[contollerName] = app;
      parent.use(app);
    }
    setupRoutes(obj);
  });
};

/**
 * Version
 * @type {String}
 */
exports.version = JSON.parse(require('fs').readFileSync(__dirname + '/../package.json')).version;
