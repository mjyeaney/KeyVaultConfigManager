/*

Handles the process of getting and caching/refreshing bearer tokens 
using the ADAL library.

*/

(function(scope){
    // Ensure namepsace
    if (!scope.TokenCache){
        scope.TokenCache = {};
    }

    var settings = require('../settings.js').Settings;

    // local log function
    function logMsg(msg){
        console.log("[adalTokenCache]:: " + msg)
    }

    // our cache store
    var _tokenCache = {};

    // auto refresh of token, as per settings interval
    function refreshToken(){
        logMsg("Refreshing cached tokens...");
    };

    // Create background job to refresh token
    logMsg("Starting token cache services...");
    setInterval(refreshToken, settings.DefaultTokenLifetimeSec * 1000)

    // Simply returns the active token
    function acquireToken(resourceUri){
        return _token[resourceUri];
    };

    // export methods
    scope.TokenCache.AcquireToken = acquireToken;
})(this);