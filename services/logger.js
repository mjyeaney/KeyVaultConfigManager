//
// Central module for standard logging output
//

(function(scope){
    var moment = require('moment');

    if (!scope.Logger){
        scope.Logger = {};
    }

    let _logBuffer = [];

    const getLogStream = (onComplete) => {
        onComplete(_logBuffer.join('\n'));
    };

    const writeLogMessage = (msg) => {
        let d = moment().toISOString(true);
        let formattedMsg = `[${d}]: INFO: ${msg}`;
        _logBuffer.push(formattedMsg);
    };

    const writeWarningMessage = (msg) => {
        let d = moment().toISOString(true);
        let formattedMsg = `[${d}]: WARNING: ${msg}`;
        _logBuffer.push(formattedMsg);
    };

    const writeErrorMessage = (msg) => {
        let d = moment().toISOString(true);
        let formattedMsg = `[${d}]: ERROR: ${msg}`;
        _logBuffer.push(formattedMsg);
    };

    // Module exports
    scope.Logger.Log = writeLogMessage;
    scope.Logger.LogWarning = writeWarningMessage;
    scope.Logger.LogError = writeErrorMessage;
    scope.Logger.GetLogStream = getLogStream;

})(this);