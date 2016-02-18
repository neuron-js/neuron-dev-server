'use strict'

module.exports = dev

var node_path = require('path')
var fs = require('fs')
var node_url = require('url')

var send = require('send')
var request = require('request')
// memoized url.parse
var parse_url = require('parseurl')
var make_array = require('make-array')
var router = require('neuron-router')


function dev (options) {
  function middleware (req, res, next) {
    var parsed = parse_url(req)
    var pathname = parsed.pathname

    if (!middleware.router) {
      middleware.router = router(options)
    }

    middleware.router.route(pathname, function (filename, fallback_url) {
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

  return middleware
}
