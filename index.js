'use strict';

module.exports = dev;
dev.options = clean_options;

var node_path = require('path');
var fs = require('fs');
var node_url = require('url');

var send = require('send');
var request = require('request');
// memoized url.parse
var parse_url = require('parseurl');
var make_array = require('make-array');


function dev (options) {
  return middleware;

  function middleware (req, res, next) {
    var router;
    var parsed = parse_url(req);

    function _next () {
      if (!options.by_pass) {
        return next();
      }

      // Default fallback
      by_pass(parsed.path, options.by_pass);
    }

    options.routers.some(function (r) {
      if (parsed.pathname.indexOf(r.location) === 0) {
        router = r;
        return true;
      }
    });

    if (!router) {
      return _next();
    }

    var pathname = parsed.pathname.slice(router.location.length);
    // TODO: check if req.url has queries
    var filename = node_path.join(router.root, pathname);

    function by_pass (pathname, to) {
      var url = node_url.resolve(to, pathname);
      request(url).pipe(res);
    }

    fs.exists(filename, function (exists) {
      if (exists) {
        return send(req, pathname, {
          root: router.root
        }).pipe(res);
      }

      if (!router.by_pass) {
        return _next();
      }

      // by pass the replaced pathname
      by_pass(pathname + parsed.search, router.by_pass);
    });
  }
}


// @param {path} base_root, the base root to solve paths with
function clean_options (options, base_root) {
  options = options || {};
  options.routers = options.routers || [];

  var default_router;

  options.routers = options.routers
    .map(function (router) {
      if (!router.location || !router.root) {
        return;
      }

      router.location = clean_path(router.location);
      router.root = make_array(router.root)

      if (base_root) {
        router.root = router.root.map(function (r) {
          return node_path.resolve(base_root, r)
        })
      }

      if (router.by_pass) {
        // `url.resolve` is different with `path.resolve`,
        // make sure there is a slash at the end
        router.by_pass = make_sure_trailing_slash(router.by_pass);
      }

      if (router.default) {
        default_router = router;
      }
      
      return router;
    })
    .filter(Boolean);

  default_router = default_router || options.routers[0];

  if (default_router) {
    options.routers.default = default_router;
  }

  // default by_pass
  if (options.by_pass) {
    options.by_pass = make_sure_trailing_slash(options.by_pass);
  }

  return options;
}


function clean_path (path) {
  return path
    // 'mod' -> '/mod'
    .replace(/^\/*/, '/')
    // '/mod' -> '/mod/', so that it will not match '/module'
    .replace(/\/*$/, '/');
}


function make_sure_trailing_slash (str) {
  return str.replace(/\/*$/, '/');
}
