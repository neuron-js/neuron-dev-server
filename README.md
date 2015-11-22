[![Build Status](https://travis-ci.org/neuron-js/neuron-dev-server.svg?branch=master)](https://travis-ci.org/neuron-js/neuron-dev-server)

<!-- [![NPM version](https://badge.fury.io/js/neuron-dev-server.svg)](http://badge.fury.io/js/neuron-dev-server)
[![npm module downloads per month](http://img.shields.io/npm/dm/neuron-dev-server.svg)](https://www.npmjs.org/package/neuron-dev-server)
[![Dependency Status](https://david-dm.org/neuron-js/neuron-dev-server.svg)](https://david-dm.org/neuron-js/neuron-dev-server) -->

# neuron-dev-server

Neuron dev server for static files, with smart resource reloading enabled.

neuron-dev-server is initially intent for `neuron.js`, but it is a completely isolated and standalone module, which could be used for any projects.

**Features:**

- livereload

## Install

```sh
$ npm install neuron-dev-server --save
```

## Usage

#### For example, in conjunction with Express

```js
var middleware = require('neuron-dev-server');
var neuron = middleware(options);

var app = require('express')();
// Use neuron-dev-server middleware for express
app.use(neuron)

var server = require('http').createServer(app);
// Attaches reload socket tunnel to the http server
neuron.attach(server);

server.listen(8000);
```

- **options** `Object`, a sample configuration, see 'sample.neuron.config.js.server'


## License

MIT
