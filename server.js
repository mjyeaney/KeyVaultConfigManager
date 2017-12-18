/* global process, __dirname */

//
// Main node entry point. This file will be automatically
// bootstrapped by the Azure runtime.
//

//
// Pull in libs and bootstrap express application
//
const express = require('express'),
    core = require('./services/application.js').Application,
    adalTokenCache = require('./services/adalTokenCache.js').TokenCache;
    
// Init the express engine
const app = express();

// Check for the PORT env var from the azure host
const port = process.env.PORT || 8009;

//
// Helper fn to set no-cache headers
//
const setNoCache = function(res){
    res.append('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
};

//
// Enable basic static resource support
//
app.use(express.static(__dirname, {
    index : 'default.html'
}));

//
// Basic API entry points here
//
app.get('/vaults', (req, resp) => {
    setNoCache(resp);
    resp.json(core.ListKeyVaults());
});

//
// Init server listener loop
//
const server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server now listening at http://%s:%s', host, port);
});
