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
const express = require('express')
//const app = express()
const url = require('url')
const request = require('request')

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

// Takes array of addresses to go though all

rl.on('line', (input) => {
    // make timed interval
    setInterval( monitor.makeRequest, config.waittime, input, function(res) {
        logger.info( "URL: " + res.element + 
                    " Statuscode: " + res.statusCode + 
                    " Responsetime: " + res.responseTime )
        }
    )

});

