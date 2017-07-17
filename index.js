/* 
    Reads file line by line
*/

// Other files
const config = require('./config.json')
const logger = require('./logger.js')

// 1st party packages
const fs = require('fs');

// 3rd party packages
const winston = require('winston')
const express = require('express')
const app = express()
const url = require('url')
const request = require('request')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var myArgs = process.argv.slice(2);
if( myArgs[0] ) {
    config.waittime = myArgs[0]
}

let readline = require('readline')
let inputFile = fs.createReadStream('links.txt')
var lines;

const rl = readline.createInterface({
    input: inputFile,
    output: process.stdout
});


// Takes array of addresses to go though all
function makeRequest( input ) {

    winston.debug( "input: " + input )

    let element = input.split(' ', 1).toString()
    let info = input.split(' ', 2)[1];

    var opts = {
        url: element,
        timeout: 10000
    }
    
    var start = new Date();     // timer set

    request.get(opts, function (err, res, body) {

        var responseTime = new Date() - start;
        // Get the content type
        let contenttype = res.headers['content-type']
        // Compare that the line exists in content-type
        if (!contenttype.includes(info))
            winston.info("Type does not match: " + info )
        // Get error case
        if (err)
            winston.error(err);
        else if (res.statusCode === 200) {
            winston.info("Page OK");
        }
        // logging
        logger.info( "URL: " + element + " Statuscode: " + res.statusCode + " Responsetime: " + responseTime )

    });
}

rl.on('line', (input) => {    
    // make timed interval
    setInterval( makeRequest, config.waittime, input);
});

