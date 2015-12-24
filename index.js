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
var router = require('neuron-router')


function dev (options) {
  return middleware;

  function middleware (req, res, next) {
    var parsed = parse_url(req)
    var pathname = parsed.pathname

    router.route(pathname, options, function (filename, fallback_url) {
      if (filename) {
        res.sendFile(filename)
        return
      }

      if (fallback_url) {
        return request(fallback_url).pipe(res)
      }

      next()
    })
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
