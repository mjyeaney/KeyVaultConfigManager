//
// Handles the process of getting and caching/refreshing bearer tokens  
// using the ADAL library.
//

(function(scope){
    const settings = require('../settings.js').Settings,
        logger = require('./logger.js').Logger;
    
    // Ensure namepsace
    if (!scope.TokenCache){
        scope.TokenCache = {};
    }

    // our cache store
    var _tokenCache = {};

    // auto refresh of token, as per settings interval
    const refreshToken = () => {
        logger.Log("Refreshing cached tokens...");
    };

    // Create background job to refresh token
    logger.Log("Starting token cache services...");
    setInterval(refreshToken, settings.DefaultTokenLifetimeSec * 1000)

    // Simply returns the active token
    const acquireToken = (resourceUri) => {
        return _token[resourceUri];
    };

    // export methods
    scope.TokenCache.AcquireToken = acquireToken;
})(this);