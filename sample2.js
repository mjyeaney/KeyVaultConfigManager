var Settings = require('./settings.js').Settings;
var KeyVault = require('azure-keyvault');
var AuthenticationContext = require('adal-node').AuthenticationContext;

var clientId = Settings.ClientID;
var clientSecret = Settings.Key;
var vaultUri = 'https://mjysamplekeyvault.vault.azure.net';

// Authenticator - retrieves the access token
var authenticator = function (challenge, callback) {

    // Create a new authentication context.
    var context = new AuthenticationContext(challenge.authorization);

    console.log("CREDS: " + challenge.resource);

    // Use the context to acquire an authentication token.
    return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
        if (err) throw err;
        // Calculate the value to be set in the request's Authorization header and resume the call.
        var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;

        return callback(null, authorizationValue);
    });

};

var credentials = new KeyVault.KeyVaultCredentials(authenticator);
var client = new KeyVault.KeyVaultClient(credentials);

client.getKeys(vaultUri, function (err, response) {
    if (err) {
        console.log("ERROR: ");
        console.log(err);
    } else {
        console.log(response);
    }
});