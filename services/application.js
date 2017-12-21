//
// Contains the main application logic/workflow
//

(function(scope){
    // Module imports
    const settings = require("../settings.js").Settings,
        logger = require("../services/logger.js").Logger,
        tokenCache = require("../services/adalTokenCache.js").TokenCache,
        dataCache = require("../services/dataCache.js").DataCache,
        async = require("async"),
        AzureCommon = require("azure-common"),
        keyVaultManagementClient = require("azure-arm-keyvault"),
        KeyVault = require("azure-keyvault");

    const ARM_MGMT_URI = "https://management.core.windows.net/",
        KEYVAULT_MGMT_URI = "https://vault.azure.net",
        CACHE_LIST_KEYVAULTS = "LIST_KEYVAULTS",
        CACHE_LIST_KV_SECRETS = "LIST_KV_SECRETS";

    // Make container for applicaiton
    if (!scope.Application){
        scope.Application = {};
    }

    const listKeyVaults = function(onComplete){
        dataCache.Get(CACHE_LIST_KEYVAULTS, (list) => {
            if (!list){
                // Read/get our access credentials from the token cache
                tokenCache.AcquireToken(ARM_MGMT_URI, (credentials) => {
                    // Creates an ARM client
                    logger.Log("Getting list of KeyVaults...");
                    let client = new keyVaultManagementClient(credentials, settings.SubscriptionID);

                    client.vaults.list((err, response) => {
                        if (err){
                            logger.Log("ERROR: " + err);
                            onComplete(err);
                        } else {
                            logger.Log("Done!");
                            dataCache.Set(CACHE_LIST_KEYVAULTS, response);
                            onComplete(null, response);
                        }
                    });
                });
            } else {
                onComplete(null, list);
            }
        });
    };

    const listKeyVaultSettings = function(onComplete){
        dataCache.Get(CACHE_LIST_KV_SECRETS, (list) => {
            if (!list){
                // Read/get our access credentials from the token cache
                tokenCache.AcquireToken(KEYVAULT_MGMT_URI, (credentials) => {
                    // Creates an AKV client
                    logger.Log("Getting list of Secrets...");
                    let client = new KeyVault.KeyVaultClient(credentials);

                    client.getSecrets('https://mjysamplekeyvault.vault.azure.net', (err, response) =>{
                        if (err){
                            logger.Log("ERROR: " + err);
                        } else {
                            logger.Log("Done!");
                            dataCache.Set(CACHE_LIST_KV_SECRETS, response);
                            onComplete(null, response);
                        }
                    });
                });
            } else {
                onComplete(null, list);
            }
        });
    };

    // Export methods
    scope.Application.ListKeyVaults = listKeyVaults;
    scope.Application.ListKeyVaultSettings = listKeyVaultSettings;
})(this);