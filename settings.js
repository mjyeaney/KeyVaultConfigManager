//
// Global configuration settings; override per-environment settings in settings.local.js
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
    scope.Settings.ClientID = "--TODO--";
    scope.Settings.Key = "--TODO--";
    scope.Settings.SubscriptionID = "--TODO--";

    // ADAL token refresh interval
    scope.Settings.DefaultTokenLifetimeSec = 300;
    console.log("Default settings initialized...");

    // Look for any local / environmental overrides
    try {
        var locals = require('./settings.local.js').Locals;
        locals.Apply(scope.Settings);
        console.log("Local overrides applied!!!");
    } catch(e){
        console.log("Unable to locate local overrides");
    }
    
})(this);