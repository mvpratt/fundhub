
var DefaultBuilder = require("truffle-default-builder");

module.exports = {
  build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "skeleton.css": [
      "stylesheets/skeleton.css"
    ],
    "normalize.css": [
      "stylesheets/normalize.css"
    ],    
    "custom.css": [
      "stylesheets/custom.css"
    ], 
    "images/": "images/"
  }),
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "42" // Match any network id
    }
  }
};