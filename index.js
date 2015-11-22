'use strict';

module.exports = dev;
dev.clean_options = clean_options;

var node_path = require('path');
var fs = require('fs');
var node_url = require('url');

var send = require('send');
var request = require('request');
// memoized url.parse
var parse_url = require('parseurl');


function dev (options) {
  function middleware (req, res, next) {
    var router;
    options.routers.some(function (r) {
      if (req.url.indexOf(r.location) === 0) {
        return true;
      }
    });

    if (!router) {
      return next();
    }

    var pathname = parse_url(req.url).pathname.replace(router.location.length);

    // TODO: check if req.url has queries
    var filename = node_path.join(router.root, pathname);

    fs.exists(filename, function (exists) {
      if (exists) {
        return send(req, pathname, {
          root: router.root
        }).pipe(res);
      }

      if (!router.by_pass) {
        return next();
      }

      var url = node_url.resolve(router.by_pass, pathname);
      request(url).pipe(res);
    });
  }
}


function clean_options (options, base_root) {
  options = options || {};
  options.routers = options.routers || [];

  options.routers = options.routers
    .map(function (router) {
      if (!router.location || !router.root) {
        return;
      }

      router.location = clean_path(router.location);

      if (base_root) {
        router.root = node_path.resolve(base_root, router.root);
      }

      if (router.by_pass) {
        // `url.resolve` is different with `path.resolve`,
        // make sure there is a slash at the end
        router.by_pass = router.by_pass.replace(/\/*$/, '/');
      }
      
      return router;
    })
    .filter(Boolean);

  return options;
}


function clean_path (path) {
  return path
    // 'mod' -> '/mod'
    .replace(/^\/*/, '/')
    // '/mod' -> '/mod/', so that it will not match '/module'
    .replace(/\/*$/, '/');
}
