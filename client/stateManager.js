//
// Client-side state manager.
//

(function(scope){
    if (!scope.StateManager){
        scope.StateManager = {};
    }

    scope.StateManager.CurrentVault = "";
    scope.StateManager.CurrentSetting = "";
})(this);