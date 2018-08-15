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
        logger = require("../services/logger.js").Logger,
        redis = require("redis");

    // Define module namespace
    if (!scope.DataCache){
        scope.DataCache = {};
    }

    // Cache metrics
    let _hits = 0,
        _total = 0;

    // our redis client
    let cacheClient = redis.createClient(settings.RedisPort, 
        settings.RedisClusterName, 
        { 
            auth_pass: settings.RedisAuthKey, 
            tls: {
                servername: settings.RedisClusterName
            }
        });

    // auto purge of data cache
    const refreshCache = () => {
        logger.Log("Purging cached data...");
        _hits = 0;
        _total = 0;
        cacheClient.flushdb((err, reply) => {
            logger.Log("Done!");
        })
    };

    // Create background job to purge cache
    //logger.Log(`Starting data cache services...default lifetime = ${settings.DefaultCacheLifetimeSec}`);
    //setInterval(refreshCache, settings.DefaultCacheLifetimeSec * 1000)

    // Makes a call into the cache to check for an item
    const getCachedItem = (key, callback) => {
        let computeRatio = (hits, total) => {
            return (hits/total).toFixed(2);
        };

        if (callback != null){
            // Check feature flag
            if (settings.DisableDataCache){
                logger.LogWarning("Cache dislabled");
                callback();
            } else {
                logger.Log(`Reading data cache; key=${key}`);
                cacheClient.get(key, (err, item) => {
                    _total++;
                    if ((err) || (!item)){
                        logger.LogWarning(`Done - data cache miss (ratio = ${computeRatio(_hits, _total)})`);
                        callback();
                    } else {
                        _hits++;
                        logger.Log(`Done - data cache hit (ratio = ${computeRatio(_hits, _total)})`);
                        callback(JSON.parse(item));
                    }
                });
            }
        }
    };

    // Sets/updates an item in the cache
    const setCachedItem = (key, data, callback) => {
        // Check feature flag
        if (settings.DisableDataCache){
            logger.LogWarning("Cache dislabled");
        } else {
            logger.Log("Updating data cache...");
            // cacheClient.watch();
            // cacheClient.get(...);
            // cacheClient.multi(["SET", key, JSON.stringify(data)]).exec();
            cacheClient.set(key, JSON.stringify(data), (err, result) => {
                logger.Log("Done!");

                if (callback != null){
                    callback();
                }
            });
        }
    };

    const removeCachedItem = (key, callback) => {
        // Check feature flag
        if (settings.DisableDataCache){
            logger.LogWarning("Cache dislabled");
        } else {
            logger.Log("Removing cache item...");
            cacheClient.del(key);
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
    scope.DataCache.Remove = removeCachedItem;
    scope.DataCache.GetCacheStats = getCacheStats;
})(this);