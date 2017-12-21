//
// Contains the main application logic/workflow
//

(function(scope){
    // Module imports
    const settings = require("../settings.js").Settings,
        logger = require("../services/logger.js").Logger,
        tokenCache = require("../services/adalTokenCache.js").TokenCache,
        async = require("async"),
        AzureCommon = require("azure-common"),
        keyVaultManagementClient = require("azure-arm-keyvault"),
        KeyVault = require("azure-keyvault");

    // Make container for applicaiton
    if (!scope.Application){
        scope.Application = {};
    }

    const listKeyVaults = function(onComplete){
        // Read/get our access credentials from the token cache
        tokenCache.AcquireToken("https://management.core.windows.net/", (credentials) => {
            // Creates an ARM client
            logger.Log("Getting list of KeyVaults...");
            let client = new keyVaultManagementClient(credentials, settings.SubscriptionID);

            client.vaults.list((err, response) => {
                if (err){
                    logger.Log("ERROR: " + err);
                    onComplete(err);
                } else {
                    logger.Log("Done!");
                    onComplete(null, response);
                }
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