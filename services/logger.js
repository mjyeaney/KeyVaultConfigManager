//
// Central module for standard logging output
//

(function(scope){
    if (!scope.Logger){
        scope.Logger = {};
    }

    let moment = require('moment');
    let _logBuffer = [];

    const FLUSH_INTERVAL_MS = 15000;

    // background writer thread
    setInterval(() => {
        let currentBuffer = _logBuffer,
            j = 0;

        _logBuffer = [];

        for (j = 0; j < currentBuffer.length; j++){
            console.log(currentBuffer[j]);
        }
        
        currentBuffer = null;
    }, FLUSH_INTERVAL_MS);

    const getLogStream = (onComplete) => {
        onComplete(_logBuffer.join('\n'));
    };

    const internalWriteMessage = (prefix, msg) => {
        let d = moment().toISOString(true);
        let formattedMsg = `[${d}]: ${prefix}: ${msg}`;
        _logBuffer.push(formattedMsg);
    };

    const writeLogMessage = (msg) => {
        internalWriteMessage("INFO", msg);
    };

    const writeWarningMessage = (msg) => {
        internalWriteMessage("WARNING", msg);
    };

    const writeErrorMessage = (msg) => {
        internalWriteMessage("ERROR", msg);
    };

    // Module exports
    scope.Logger.Log = writeLogMessage;
    scope.Logger.LogWarning = writeWarningMessage;
    scope.Logger.LogError = writeErrorMessage;
    scope.Logger.GetLogStream = getLogStream;

})(this);