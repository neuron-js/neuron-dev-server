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
var Nginx = require('engine-x')


function dev (options) {
  function middleware (req, res, next) {
    var parsed = parse_url(req)
    var pathname = parsed.pathname

    middleware.router.route({pathname}, function (filename, fallback_url) {
      if (filename) {
        res.sendFile(filename)
        return
      }

      if (!fallback_url) {
        return next()
      }

      const headers = Object.assign({}, req.headers)
      const host = node_url.parse(fallback_url).host
      headers.host = host

      const options = {
        url: fallback_url,
        headers
      }

      request(options).on('error', function (e) {
        console.warn(
          'Neuron dev server: fails to fallback to "'
          + fallback_url
          + '": \n'
          + (e.stack || e.message || e)
        )

      }).pipe(res)
    })
  }

  if (!middleware.router) {
    middleware.router = new Nginx(options)
  }

  return middleware
}
