module.exports = {
  build: {
    "index.html": "index.html",   
    "app.js": [
      "javascripts/app.js"
    ],
    "skeleton.css": [
      "stylesheets/skeleton.css"
    ],
    "normalize.css": [
      "stylesheets/normalize.css"
    ],    
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    "staging": {
      network_id: 42 // custom private network (geth)
    },
    "development": {
      network_id: "default" // testrpc
    }
  }
};
