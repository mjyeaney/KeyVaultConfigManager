/*

Replace settings in this file with your own.

*/

(function(scope){
    // Create namespace container
    if (!scope.Settings){
        scope.Settings = {};
    }

    // local log function
    function logMsg(msg){
        console.log("[settings]:: " + msg)
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
    logMsg("Default settings initialized...")
    
})(this);

// Apply local settings (if found)
try {
    require('./settings.local.js');
    console.log("Loaded local settings!!!");
} catch (e) {
    console.log("WARNING: Local settings not found - using defaults...");
 }