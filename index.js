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
var Router = require('engine-x').Router


function dev (options) {
  function middleware (req, res, next) {
    var parsed = parse_url(req)
    var pathname = parsed.pathname

    middleware.router
      .route({pathname})
      .on('found', (filename) => {
        res.sendFile(filename)
      })
      .on('not-found', () => {
        next()
      })
      .on('error', (e) => {
        res.status(500).send(e.message || 'Internal Server Error.')
      })
      .on('proxy-pass', (url) => {
        const headers = Object.assign({}, req.headers)
        const host = node_url.parse(url).host
        headers.host = host

        const options = {
          url,
          headers
        }

        request(options).on('error', function (e) {
          console.warn(
            'Neuron dev server: fails to fallback to "'
            + url
            + '": \n'
            + (e.stack || e.message || e)
          )
        }).pipe(res)

      })
  }

  if (!middleware.router) {
    middleware.router = new Router(options)
  }

  return middleware
}
