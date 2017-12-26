/* global process, __dirname */

//
// Main node entry point. This file will be automatically
// bootstrapped by the Azure runtime.
//

//
// Pull in libs and bootstrap express application
//
const express = require("express"),
    bodyParser = require("body-parser"),
    logger = require("./services/logger.js").Logger,
    dataCache = require("./services/dataCache.js").DataCache,
    core = require("./services/application.js").Application;
    
// Init the express engine
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Check for the PORT env var from the azure host
const port = process.env.PORT || 8009;

//
// Helper fn to set no-cache headers
//
const setNoCache = function(res){
    res.append("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
};

//
// Enable basic static resource support
//
app.use(express.static(__dirname, {
    index : "default.html"
}));

//
// Basic API entry points here
//
app.get("/vaults", (req, resp) => {
    setNoCache(resp);
    core.ListKeyVaults((err, response) => {
        resp.json(response);
    })
});

app.get("/vaultSettings/:vaultName", (req, resp) => {
    setNoCache(resp);
    core.GetKeyVaultSettings(req.params.vaultName, (err, response) => {
        resp.json(response);
    });
});

app.get("/vaultSetting/:vaultName/:settingName", (req, resp) => {
    setNoCache(resp);
    core.GetKeyVaultSetting(req.params.vaultName, req.params.settingName, (err, response) => {
        if (err){
            resp.status(500).send(err);
        } else {
            resp.json(response);
        }
    });
});

app.post("/vaultSetting/:vaultName/:settingName", (req, resp) => {
    setNoCache(resp);
    core.SetKeyVaultSetting(req.params.vaultName, req.params.settingName, req.body.settingValue, (err, response) => {
        if (err){
            resp.status(500).send(err);
        } else {
            resp.json(response);
        }
    });
});

app.get("/logStream", (req, resp) => {
    setNoCache(resp);
    logger.GetLogStream((stream) => {
        resp.json(stream);
    })
});

app.get("/cacheStats", (req, resp) => {
    setNoCache(resp);
    dataCache.GetCacheStats((stream) => {
        resp.json(stream);
    })
});

//
// Init server listener loop
//
const server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.Log(`Server now listening at http://${host}:${port}`);
});
