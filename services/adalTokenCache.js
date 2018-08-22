//
// Handles the process of getting and caching/refreshing bearer tokens  
// using the ADAL library.
//

(function(scope){
    const settings = require('../settings.js').Settings,
        logger = require('./logger.js').Logger,
        msRestAzure = require("ms-rest-azure");
    
    // Ensure namepsace
    if (!scope.TokenCache){
        scope.TokenCache = {};
    }

    // our cache store
    let _tokenCache = {};

    // auto refresh of token, as per settings interval
    const refreshToken = () => {
        logger.Log("Refreshing cached tokens...");
        _tokenCache = {};
    };

    // Create background job to refresh token
    logger.Log(`Starting token cache services...default lifetime = ${settings.DefaultTokenLifetimeSec}`);
    setInterval(refreshToken, settings.DefaultTokenLifetimeSec * 1000)

    const _internalAcquireToken = (resourceUri, onComplete) => {
        // Setup ADAL parameters
        let clientId = settings.ClientID;
        let clientSecret = settings.Key;
        let tenant = settings.Tenant;

        // Use secrets to get a token
        logger.Log("Acquiring token...");
        msRestAzure.loginWithServicePrincipalSecret(clientId, clientSecret, tenant, (err, credentials, subscriptions) => {
            if (err) {
                logger.LogError(err.stack);
                onComplete(err);
            } else {
                logger.Log("Token acquired...creating TokenCloudCredentials...");  
                logger.Log(JSON.stringify(credentials));
                onComplete(null, credentials);
            }
        });
    };

    // Simply returns the active token
    const acquireToken = (resourceUri, callback) => {
        // check feature flag 
        if (settings.DisableAdalCache){
            _internalAcquireToken(resourceUri, (err, credentials) => {
                logger.Log("(ADAL Cache disabled) - resuming execution");
                if (err){
                    logger.LogError(err);
                }
                callback(err, credentials);
            })
            return;
        }

        // check cache first
        if (!_tokenCache[resourceUri]){
            logger.LogWarning("Token cache MISS...acquiring token...");
            _internalAcquireToken(resourceUri, (err, credentials) => {
                logger.Log("Token acquired - resuming execution");
                if (!err) {
                    _tokenCache[resourceUri] = credentials;
                } else {
                    logger.LogError(err);
                }
                callback(err, credentials);
            })
        } else {
            logger.Log("Token cache HIT!");
            callback(_tokenCache[resourceUri]);
        }
    };

    // export methods
    scope.TokenCache.AcquireToken = acquireToken;
})(this);