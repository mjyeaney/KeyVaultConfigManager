//
// Global configuration settings; override per-environment settings in settings.local.js
//
// TODO: Convert this to environment variables
// 

(function(scope){
    // Create namespace container
    if (!scope.Settings){
        scope.Settings = {};
    }

    // 
    // Export application settings here (READ these from the environment...
    // thsee are only here for temporary use.)
    //
    scope.Settings.ClientID = process.env.KVCM_ClientId;
    scope.Settings.Key = process.env.KVCM_Key;
    scope.Settings.SubscriptionID = process.env.KVCM_SubscriptionId;
    scope.Settings.Tenant = process.env.KVCM_Tenant;
    scope.Settings.LogFlushIntervalMs = parseInt(process.env.KVCM_LogFlushIntervalMs);
    scope.Settings.RedisClusterName = process.env.KVCM_RedisClusterName;
    scope.Settings.RedisAuthKey = process.env.KVCM_RedisAuthKey;
    scope.Settings.RedisPort = parseInt(process.env.KVCM_RedisPort);

    // ADAL/Data cache refresh interval
    scope.Settings.DefaultTokenLifetimeSec = 120;
    scope.Settings.DefaultCacheLifetimeSec = 240;

    // Feature flags
    scope.Settings.IsRunningLocal = false;
    scope.Settings.DisableDataCache = false;
    scope.Settings.DisableAdalCache = false;

    // Client flags (as-needed)
    scope.Settings.ClientConfiguration = {};

    // Look for any local / environmental overrides
    try {
        var locals = require('./settings.local.js').Locals;
        locals.Apply(scope.Settings);
        scope.Settings.IsRunningLocal = true;
    } catch(e){
        // No local override found...
        console.log("No local override settings found");
    }
    
})(this);