/*

Contains the main application logic/workflow

*/

(function(scope){
    // Make container for applicaiton
    if (!scope.Application){
        scope.Application = {};
    }

    var listKeyVaults = function(){
        return [{
            Name: "sample key vault",
            ResourceGroup: "Some RG",
            Location: "South Central US"
        }];
    };

    var createKeyVault = function(){

    };

    var listVaultKeys = function(vaultName){

    };

    // Export methods
    scope.Application.ListKeyVaults = listKeyVaults;
})(this);