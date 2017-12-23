//
// Impelments a data caching layer. This will need swapped out for 
// Redis once stable (make sure all calls are ASYNC) so we can operate 
// across mutliple nodes.
//
// Other options are to keep the local caches, but use redis as a messaging
// backplane to keep them in sync w/version stamps.
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
    const getCachedItem = (key, callback) => {
        let computeRatio = (hits, total) => {
            return (hits/total).toFixed(2);
        };

        if (callback != null){
            // Check feature flag
            if (settings.DisableDataCache){
                logger.Log("Cache dislabled");
                callback();
            } else {
                logger.Log(`Reading data cache; key=${key}`);
                let item = _cache[key];
                _total++;
                if (!item){
                    logger.Log(`Done - data cache miss (ratio = ${computeRatio(_hits, _total)})`);
                } else {
                    _hits++;
                    logger.Log(`Done - data cache hit (ratio = ${computeRatio(_hits, _total)})`);
                }
                callback(item);
            }
        }
    };

    // Sets/updates an item in the cache
    const setCachedItem = (key, data, callback) => {
        // Check feature flag
        if (settings.DisableDataCache){
            logger.Log("Cache dislabled");
        } else {
            logger.Log("Updating data cache...");
            _cache[key] = data;
            logger.Log("Done!");
        }

        if (callback != null){
            callback();
        }
    };

    const getCacheStats = (callback) => {
        if (callback != null){
            callback("TODO");
        }
    };

    // Method exports
    scope.DataCache.Get = getCachedItem;
    scope.DataCache.Set = setCachedItem;
    scope.DataCache.GetCacheStats = getCacheStats;
})(this);