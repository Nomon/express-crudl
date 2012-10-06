/*!
  *
  *
  *
  */



/**
 * Module dependencies
 */

// Make sure express doesn't use lib-cov ... :)

var express = require('express')
  , fs = require('fs');
// restore env

/**
 * Express application that we mount and read settings from.
 *
 * @param app Express.js application
 */
module.exports = function crud(parent, options) {
  options = options || {};
  var verbose = options.verbose || false;
  var controllerPath = options.controller_path || parent.set('controller path') || process.cwd() + '/controllers/';
  fs.readdirSync(controllerPath).forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require(controllerPath + name)
    function setupRoutes(obj) {
      var name = obj.name || name
      , prefix = obj.prefix || ''
      , app = express()
      , method
      , path;

      // before middleware support
      prefix = prefix || '';
      if (obj.before) {
        path = prefix + name + '/:' + name + '_id';
        app.all(path, obj.before);
        verbose && console.log('     ALL %s -> before', path);
        path = prefix + name + '/:' + name + '_id/*';
        app.all(path, obj.before);
        verbose && console.log('     ALL %s -> before', path);
      }

      // generate routes based
      // on the exported methods
      for (var key in obj) {
        // "reserved" exports
        if (~['name', 'prefix', 'engine', 'before', 'subresources'].indexOf(key)) continue;
        // route exports
        switch (key) {
          case 'read':
            method = 'get';
            path = '/' + name + '/:' + name + '_id';
            break;
          case 'list':
            method = 'get';
            path = '/' + name;
            break;
          case 'update':
            method = 'put';
            path = '/' + name + '/:' + name + '_id';
            break;
          case 'create':
            method = 'post';
            path = '/' + name + '';
            break;
          case 'del':
            method = 'del';
            path = '/' + name + '/:' + name + '_id';
            break;
          default:
            throw new Error('unrecognized route: ' + name + '.' + key);
        }
        path = prefix + path;
        app[method](path, obj[key]);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
      }

      if(obj.subresources) {
        verbose && console.log('  subresources');
        Object.keys(obj.subresources).forEach(function(resource) {
          obj.subresources[resource].prefix = obj.subresources[resource].prefix || '/'+name+'/:'+name+'_id';
          obj.subresources[resource].name = obj.subresources[resource].name || resource;
          setupRoutes(obj.subresources[resource])
        });
      }
      parent.controllers = parent.controllers || {};
      parent.controllers[name] = app;
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
