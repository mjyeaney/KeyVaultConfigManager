/*

Handles the process of getting and caching/refreshing bearer tokens 
using the ADAL library.

*/

(function(scope){
    // Ensure namepsace
    if (!scope.TokenCache){
        scope.TokenCache = {};
    }

    // Make sure our settings our available
    if (!scope.Settings){
        throw "Required module 'Settings' not detected..."
    }

    // our cache store
    var _tokenCache = {};

    // auto refresh of token, as per settings interval
    function refreshToken(){
        console.log("Refreshing cached tokens...");
    };

    // Create background job to refresh token
    console.log("Starting cache services...");
    setInterval(refreshToken, settings.DefaultTokenLifetimeSec)

    // Simply returns the active token
    function acquireToken(resourceUri){
        return _token[resourceUri];
    };

    // export methods
    scope.TokenCache.AcquireToken = acquireToken;
})(this);