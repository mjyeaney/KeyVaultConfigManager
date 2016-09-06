// Fiddler magic
// process.env.https_proxy = "http://127.0.0.1:8888";
// process.env.http_proxy = "http://127.0.0.1:8888";
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Module imports
var settings = require('./settings.js').Settings;
var async = require('async');
var adal = require('adal-node');
var AzureCommon = require('azure-common');
var keyVaultManagementClient = require('azure-arm-keyvault');
var KeyVault = require('azure-keyvault');

// Setup ADAL parameters
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'j2mc.onmicrosoft.com';
var authorityUrl = authorityHostUrl + '/' + tenant;
var clientId = settings.ClientID;
var clientSecret = settings.Key;

// Used when managing the keyvault as a RESOURCE.
//var resource = 'https://management.core.windows.net/';

// Used when working with the values INSIDE the keyvault
var resource = 'https://vault.azure.net';

// Create ADAL context
var AuthenticationContext = adal.AuthenticationContext;
var context = new AuthenticationContext(authorityUrl);

// Use secrets to get a token
console.log("Acquiring token...");
context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function(err, tokenResponse) {
  if (err) {
    console.log('ERROR: ' + err.stack);
  } else {
    console.log("Token acquired...creating KeyVault client...");  
    var credentials = new AzureCommon.TokenCloudCredentials({
        subscriptionId : settings.SubscriptionID,
        authorizationScheme : tokenResponse.tokenType,
        token : tokenResponse.accessToken
    });

    // Creates an ARM client
    //var client = new keyVaultManagementClient(credentials, settings.SubscriptionID);
    // Create service client
    var client = new KeyVault.KeyVaultClient(credentials);

    // Sequence async operations for our tests
    async.series([
/*
        // LIST KEYVAULTS
        function(callback){
            console.log("Getting list of KeyVaults...");
            client.vaults.list(function(err, response){
                if (err){
                    console.log("ERROR: " + err);
                } else {
                    console.log("Retrieved list of KeyVaults: ");
                    console.log(response);
                }
                callback();
            })
        },
*/

        // Get Keys
        function(callback){
            console.log("Getting list of keys from vault...");
   
            client.getSecrets('https://mjysamplekeyvault.vault.azure.net', function(err, results){
                if (err){
                    console.log(err);
                } else {
                    console.log(results);
                    callback();
                }
            });
        },

        // Get Secret for a key
        function(callback){
            console.log("TODO: Getting secret value...");
            client.getSecret('https://mjysamplekeyvault.vault.azure.net/secrets/testkey1/', function(err, results){
                if (err){
                    console.log(err);
                } else {
                    console.log(results);
                    callback();
                }
            });
        }
    ], function(err, result){
        console.log("Done!!!");
    });
  }
});