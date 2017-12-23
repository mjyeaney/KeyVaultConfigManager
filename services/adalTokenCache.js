//
// Handles the process of getting and caching/refreshing bearer tokens  
// using the ADAL library.
//

(function(scope){
    const settings = require('../settings.js').Settings,
        logger = require('./logger.js').Logger,
        adal = require('adal-node'),
        AzureCommon = require("azure-common");
    
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
        let authorityHostUrl = 'https://login.windows.net';
        let tenant = settings.Tenant;
        let authorityUrl = authorityHostUrl + '/' + tenant;
        let clientId = settings.ClientID;
        let clientSecret = settings.Key;

        // Create ADAL context
        let AuthenticationContext = adal.AuthenticationContext;
        let context = new AuthenticationContext(authorityUrl);

        // Use secrets to get a token
        logger.Log("Acquiring token...");
        context.acquireTokenWithClientCredentials(resourceUri, clientId, clientSecret, (err, tokenResponse) => {
            if (err) {
                logger.Log('ERROR: ' + err.stack);
                onComplete(err);
            }

            logger.Log("Token acquired...creating TokenCloudCredentials...");  

            let credentials = new AzureCommon.TokenCloudCredentials({
                subscriptionId : settings.SubscriptionID,
                authorizationScheme : tokenResponse.tokenType,
                token : tokenResponse.accessToken
            });

            onComplete(credentials);
        });
    };

    // Simply returns the active token
    const acquireToken = (resourceUri, callback) => {
        // check feature flag 
        if (settings.DisableAdalCache){
            _internalAcquireToken(resourceUri, (credentials) => {
                logger.Log("Token acquired (ADAL Cache disabled) - resuming execution");
                callback(credentials);
            })
            return;
        }

        // check cache first
        if (!_tokenCache[resourceUri]){
            logger.Log("Token cache MISS...acquiring token...");
            _internalAcquireToken(resourceUri, (credentials) => {
                logger.Log("Token acquired - resuming execution");
                _tokenCache[resourceUri] = credentials;
                callback(credentials);
            })
        } else {
            logger.Log("Token cache HIT!");
            callback(_tokenCache[resourceUri]);
        }
    };

    // export methods
    scope.TokenCache.AcquireToken = acquireToken;
})(this);