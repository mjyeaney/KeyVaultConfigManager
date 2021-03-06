//
// Contains the main application logic/workflow
//

(function(scope){
    // Module imports
    const settings = require("../settings.js").Settings,
        logger = require("../services/logger.js").Logger,
        tokenCache = require("../services/adalTokenCache.js").TokenCache,
        dataCache = require("../services/dataCache.js").DataCache,
        keyVaultManagementClient = require("azure-arm-keyvault"),
        KeyVault = require("azure-keyvault");

    const ARM_MGMT_URI = "https://management.core.windows.net/",
        KEYVAULT_MGMT_URI = "https://vault.azure.net",
        CACHE_LIST_KEYVAULTS = "LIST_KEYVAULTS",
        CACHE_LIST_KV_SECRETS = "LIST_KV_SECRETS";
        CACHE_GET_KV_SECRET = "GET_KV_SECRET";

    // Make container for applicaiton
    if (!scope.Application){
        scope.Application = {};
    }

    const listKeyVaults = function(onComplete){
        dataCache.Get(CACHE_LIST_KEYVAULTS, (list) => {
            if (!list){
                // Read/get our access credentials from the token cache
                tokenCache.AcquireToken(ARM_MGMT_URI, (err, credentials) => {
                    // Creates an ARM client
                    logger.Log("Getting list of KeyVaults...");
                    let client = new keyVaultManagementClient(credentials, settings.SubscriptionID);

                    client.vaults.list((err, response) => {
                        if (err){
                            logger.LogError(err);
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

    const getKeyVaultSettings = function(vaultName, onComplete){
        let cacheKey = `${CACHE_LIST_KV_SECRETS}:${vaultName}`;
        dataCache.Get(cacheKey, (list) => {
            if (!list){
                // Read/get our access credentials from the token cache
                tokenCache.AcquireToken(KEYVAULT_MGMT_URI, (err, credentials) => {
                    // Creates an AKV client
                    logger.Log("Getting list of Secrets...");
                    let client = new KeyVault.KeyVaultClient(credentials);
                    let vaultUri = `https://${vaultName}.vault.azure.net`;

                    client.getSecrets(vaultUri, (err, response) =>{
                        if (err){
                            logger.LogError(err);
                            onComplete(err);
                        } else {
                            logger.Log("Done!");
                            response.sort((x, y) => {
                                if (x < y) return -1;
                                else if (x > y) return 1;
                                else return 0;
                            });
                            dataCache.Set(cacheKey, response);
                            onComplete(null, response);
                        }
                    });
                });
            } else {
                onComplete(null, list);
            }
        });
    };

    const getKeyVaultSetting = function(vaultName, settingName, onComplete){
        let cacheKey = `${CACHE_GET_KV_SECRET}:${vaultName}:${settingName}`;
        dataCache.Get(cacheKey, (list) => {
            if (!list){        
                // Read/get our access credentials from the token cache
                tokenCache.AcquireToken(KEYVAULT_MGMT_URI, (err, credentials) => {
                    if (!err) {
                        // Creates an AKV client
                        logger.Log("Getting secret value...");
                        let client = new KeyVault.KeyVaultClient(credentials);
                        let vaultBaseUrl = `https://${vaultName}.vault.azure.net`;
                        let latestVersion = '';

                        client.getSecret(vaultBaseUrl, settingName, latestVersion, (err, results) => {
                            if (err){
                                logger.LogError(err);
                                onComplete(err);
                            } else {
                                logger.Log("Done!");
                                dataCache.Set(cacheKey, results);
                                onComplete(null, results);
                            }
                        });
                    } else {
                        onComplete(err);
                    }
                });
            } else {
                onComplete(null, list);
            }
        });
    };

    const setKeyVaultSetting = function(vaultName, settingName, settingValue, onComplete){
        let cacheKey = `${CACHE_GET_KV_SECRET}:${vaultName}:${settingName}`;

        // Read/get our access credentials from the token cache
        tokenCache.AcquireToken(KEYVAULT_MGMT_URI, (err, credentials) => {
            if (!err) {
                // Creates an AKV client
                logger.Log("Setting secret value...");
                let client = new KeyVault.KeyVaultClient(credentials);
                let vaultBaseUrl = `https://${vaultName}.vault.azure.net`;

                client.setSecret(vaultBaseUrl, settingName, settingValue, (err, results) => {
                    if (err){
                        logger.LogError(err);
                        onComplete(err);
                    } else {
                        logger.Log("Done!");
                        dataCache.Remove(cacheKey);
                        onComplete(null, results);
                    }
                });
            } else {
                onComplete(err);
            }
        });
    };

    // Export methods
    scope.Application.ListKeyVaults = listKeyVaults;
    scope.Application.GetKeyVaultSettings = getKeyVaultSettings;
    scope.Application.GetKeyVaultSetting = getKeyVaultSetting;
    scope.Application.SetKeyVaultSetting = setKeyVaultSetting;
})(this);