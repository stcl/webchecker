// native packages
var fs = require('fs');
// 3rd party packages
var winston = require('winston');

const Logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
        json: false,
        handleExceptions: true,
        timestamp: true,
        colorize: true,
        level: 'info'
    }),
    new (winston.transports.File)({
        json: false,
        handleExceptions: true,
        filename: `results.log`,
        //timestamp: tsFormat,
        level: 'info',
        prepend: true
    })
  ]
});

Logger.add = function( res ) {
    Logger.info("URL: " + res.element +
        " Statuscode: " + res.statusCode +
        " Responsetime: " + res.responseTime)
}

module.exports = exports = Logger
