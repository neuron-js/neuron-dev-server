[![Build Status](https://travis-ci.org/neuron-js/neuron-dev-server.svg?branch=master)](https://travis-ci.org/neuron-js/neuron-dev-server)

<!-- [![NPM version](https://badge.fury.io/js/neuron-dev-server.svg)](http://badge.fury.io/js/neuron-dev-server)
[![npm module downloads per month](http://img.shields.io/npm/dm/neuron-dev-server.svg)](https://www.npmjs.org/package/neuron-dev-server)
[![Dependency Status](https://david-dm.org/neuron-js/neuron-dev-server.svg)](https://david-dm.org/neuron-js/neuron-dev-server) -->

# neuron-dev-server

neuron-dev-server is a static file server and reverse proxy.

## Install

```sh
$ npm install neuron-dev-server --save
```

## Usage

#### For example, in conjunction with Express

```js
var middleware = require('neuron-dev-server');

var options = {
  routers: [
    {
      // defines it as default
      default: true,

      // If the `req.url` matches `location`
      location: '/mod',

      // Then we will search the static file from
      root: '/path/to/mod',
      
      // If not found, then bypass to:
      by_pass: 'http://domain.com/mod'

      // If by_pass not specified, then `next()` will be called
    },

    {
      location: '/static',
      root: '/path/to/static'
    },

    ...
  ],

  // All requests will be fallback to:
  by_pass: 'http://domain.com'
};


var app = require('express')();

app
  // Use neuron-dev-server middleware for express
  .use(middleware(options))
  .listen(8000);
```

### middleware.options(options)

Static method to clean the `options`.

## License

MIT
