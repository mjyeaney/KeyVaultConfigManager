//
// Impelments a data caching layer. This can be swapped out for 
// Redis once stable (make sure all calls are ASYNC)
//

(function(scope){
    const settings = require('../settings.js').Settings,
        logger = require("../services/logger.js").Logger;

    // Define module namespace
    if (!scope.DataCache){
        scope.DataCache = {};
    }

    // Simple in-memory cache to start with
    let _cache = {},
        _hits = 0,
        _total = 0;

    // auto purge of data cache
    const refreshCache = () => {
        logger.Log("Purging cached data...");
        _cache = {};
        _hits = 0;
        _total = 0;
    };

    // Create background job to purge cache
    logger.Log(`Starting data cache services...default lifetime = ${settings.DefaultCacheLifetimeSec}`);
    setInterval(refreshCache, settings.DefaultCacheLifetimeSec * 1000)

    // Makes a call into the cache to check for an item
    let getCachedItem = (key, callback) => {
        if (callback != null){
            logger.Log("Reading data cache...");
            var item = _cache[key];
            _total++;
            if (!item){
                logger.Log(`Done - data cache miss (ratio = ${(_hits/_total).toFixed(2)})`);
            } else {
                _hits++;
                logger.Log(`Done - data cache hit (ratio = ${(_hits/_total).toFixed(2)})`);
            }
            callback(item);
        }
    };

    // Sets/updates an item in the cache
    let setCachedItem = (key, data, callback) => {
        logger.Log("Updating data cache...");
        _cache[key] = data;
        logger.Log("Done!");
        if (callback != null){
            callback();
        }
    };

    // Method exports
    scope.DataCache.Get = getCachedItem;
    scope.DataCache.Set = setCachedItem;
})(this);