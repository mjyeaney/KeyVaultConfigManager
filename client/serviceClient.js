//
// Client lib for accessing server-side REST methods
//

(function(scope){
    if (!scope.ServiceClient){
        scope.ServiceClient = {};
    }

    //
    // Remote data access calls
    //
    const getVaults = function(onComplete, onError){
        $.ajax({
            url: "/vaults",
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getSettings = function(onComplete, onError){
        $.ajax({
            url: `/vaultSettings/${StateManager.CurrentVault}`,
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getSettingValue = function(onComplete, onError){
        $.ajax({
            url: `/vaultSetting/${StateManager.CurrentVault}/${StateManager.CurrentSetting}`,
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getLogStream = function(onComplete, onError){
        $.ajax({
            url: "/logStream",
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    // Export methods to module
    scope.ServiceClient.GetVaults = getVaults;
    scope.ServiceClient.GetSettings = getSettings;
    scope.ServiceClient.GetSettingValue = getSettingValue;
    scope.ServiceClient.GetLogStream = getLogStream;
})(this);