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
        let d = new Date().toISOString();
        let formattedMsg = `${d}: [INFO]: ${msg}`;
        _logBuffer.push(formattedMsg);
        console.log(formattedMsg);
    };

    // Module exports
    scope.Logger.Log = writeLogMessage;
    scope.Logger.GetLogStream = getLogStream;

})(this);