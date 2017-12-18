//
// Contains the main application logic/workflow
//

(function(scope){
    // Module imports
    const settings = require('../settings.js').Settings,
        logger = require('../services/logger.js').Logger,
        async = require('async'),
        adal = require('adal-node'),
        AzureCommon = require('azure-common'),
        keyVaultManagementClient = require('azure-arm-keyvault'),
        KeyVault = require('azure-keyvault');

    // Make container for applicaiton
    if (!scope.Application){
        scope.Application = {};
    }

    const listKeyVaults = function(onComplete){

        // Setup ADAL parameters
        let authorityHostUrl = 'https://login.windows.net';
        let tenant = settings.Tenant;
        let authorityUrl = authorityHostUrl + '/' + tenant;
        let clientId = settings.ClientID;
        let clientSecret = settings.Key;

        // Used when managing the keyvault as a RESOURCE.
        let resource = 'https://management.core.windows.net/';

        // Create ADAL context
        let AuthenticationContext = adal.AuthenticationContext;
        let context = new AuthenticationContext(authorityUrl);

        // Use secrets to get a token
        logger.Log("Acquiring token...");
        context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, (err, tokenResponse) => {
            if (err) {
                logger.Log('ERROR: ' + err.stack);
                onComplete(err);
            }

            logger.Log("Token acquired...creating KeyVault client...");  

            let credentials = new AzureCommon.TokenCloudCredentials({
                subscriptionId : settings.SubscriptionID,
                authorizationScheme : tokenResponse.tokenType,
                token : tokenResponse.accessToken
            });

            // Creates an ARM client
            let client = new keyVaultManagementClient(credentials, settings.SubscriptionID);

            // Sequence async operations for our tests
            async.series([
                // LIST KEYVAULTS
                function(next){
                    logger.Log("Getting list of KeyVaults...");
                    client.vaults.list((err, response) => {
                        if (err){
                            logger.Log("ERROR: " + err);
                            onComplete(err);
                        } else {
                            onComplete(null, response);
                        }
                        next();
                    })
                },
            ], (err, result) => {
                logger.Log("Done!!!");
            });
        });
    };

    const listKeyVaultSettings = function(onComplete){
        onComplete(null, [{
            id: "123-234",
            name: "Setting1",
            vaule: "FooBazBar"
        }]);
    };

    // Export methods
    scope.Application.ListKeyVaults = listKeyVaults;
    scope.Application.ListKeyVaultSettings = listKeyVaultSettings;
})(this);