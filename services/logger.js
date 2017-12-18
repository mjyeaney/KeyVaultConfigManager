//
// Central module for standard logging output
//

(function(scope){
    if (!scope.Logger){
        scope.Logger = {};
    }

    const writeLogMessage = (msg) => {
        console.log('[INFO]: ' + msg);
    };

    // Module exports
    scope.Logger.Log = writeLogMessage;

})(this);