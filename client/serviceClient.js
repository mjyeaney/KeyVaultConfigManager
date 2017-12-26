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

    const getSettings = function(vaultName, onComplete, onError){
        $.ajax({
            url: `/vaultSettings/${vaultName}`,
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const getSettingValue = function(vaultName, settingName, onComplete, onError){
        $.ajax({
            url: `/vaultSetting/${vaultName}/${settingName}`,
            success: function(data){
                onComplete(data);
            },
            error: function(e){
                let msg = `${e.status}: ${e.statusText}`;
                onError(msg);
            }
        });
    };

    const saveSettingValue = function(vaultName, settingName, newValue, onComplete, onError){
        $.ajax({
            type: "POST",
            url: `/vaultSetting/${vaultName}/${settingName}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ settingValue: newValue }),
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

    const getCacheStats = function(onComplete, onError){
        $.ajax({
            url: "/cacheStats",
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
    scope.ServiceClient.SaveSettingValue = saveSettingValue;
    scope.ServiceClient.GetLogStream = getLogStream;
    scope.ServiceClient.GetCacheStats = getCacheStats;
})(this);