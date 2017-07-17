/* 
    Reads file line by line
*/

// Other files
const config = require('./config.json')
const logger = require('./logger.js')
const monitor = require('./monitor.js')

// 1st party packages
const fs = require('fs');

// 3rd party packages
const winston = require('winston')
const url = require('url')

var myArgs = process.argv.slice(2);
if( myArgs[0] ) {
    config.waittime = myArgs[0]
}

let readline = require('readline')
let inputFile = fs.createReadStream('links.txt')

const rl = readline.createInterface({
    input: inputFile,
    output: process.stdout
});

// Takes array of addresses

rl.on('line', (input) => {
    // timed interval
    setInterval( monitor.makeRequest, config.waittime, input, function(res) {
        logger.add( res );
        /*
        logger.info( "URL: " + res.element + 
                    " Statuscode: " + res.statusCode + 
                    " Responsetime: " + res.responseTime )
        }*/
    
    });
})

rl.on('close', (input) => {
    winston.info( "end of file");
})