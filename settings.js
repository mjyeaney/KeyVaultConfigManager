//
// Global configuration settings; override per-environment settings in settings.local.js
// 

(function(scope){
    var logger = require('./services/logger.js').Logger;

    // Create namespace container
    if (!scope.Settings){
        scope.Settings = {};
    }

    // 
    // Export application settings here (READ these from the environment...
    // thsee are only here for temporary use.)
    //
    scope.Settings.ClientID = "--TODO--";
    scope.Settings.Key = "--TODO--";
    scope.Settings.SubscriptionID = "--TODO--";
    scope.Settings.Tenant = "--TODO--"

    // ADAL token refresh interval
    scope.Settings.DefaultTokenLifetimeSec = 120;
    logger.Log("Default settings initialized...");

    // Look for any local / environmental overrides
    try {
        var locals = require('./settings.local.js').Locals;
        locals.Apply(scope.Settings);
        logger.Log("Local overrides applied!!!");
    } catch(e){
        logger.Log("Unable to locate local overrides");
    }
    
})(this);