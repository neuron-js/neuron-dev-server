'use strict';

module.exports = {
  server: {
    patch_to: 'neuron.js',

    routers: {
      '/mod': '.static_modules/'
    },

    reverse_proxy: {

    }
  }
};
