module.exports = {
  build: {
    "index.html": "index.html",   
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    "staging": {
      network_id: 42 // custom private network
      // use default rpc settings
    },
    "development": {
      network_id: "default"
    }
  }
};
