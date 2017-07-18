/* 
    Web monitoring app
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
const express = require('express')
const app = express()

app.listen(3000, function () {
    console.log('App available at localhost:3000')
})


const myArgs = process.argv.slice(2);
if( myArgs[0] ) {
    config.waittime = myArgs[0]
}

let readline = require('readline')
let inputFile = fs.createReadStream('links.txt')

const rl = readline.createInterface({
    input: inputFile,
    output: process.stdout
});

let status = []   // State of the elements
let count = 0;      // Count of the elements in file

// Takes every line of the file
rl.on('line', (input) => {
    count++;
    // timed interval, might cause trouble if waits too long
    setInterval( monitor.makeRequest, config.waittime, input, function(res) {
        logger.add( res );
        // todo check uniques
        if( status.length < count || stateHasChanged(res) )
            status.push( { 'url': res.element, 'status': res.status } )
    })
})

/* Checks if the state of the status has changed and if it has, 
   deletes the element so that it can be overwritten */
function stateHasChanged(res) {
    for (let i = 0; i < status.length; i++) {
        if (status[i]['url'] == res.element) {
            if (status[i]['status'] != res.status) {
                status.splice(i, 1);
                return true;
            }
        }
    } 
    return false;
}

rl.on('close', (input) => {
    //count++;
    winston.info( "\nend of file");
})

app.get('/', function (req, res) {
    // Print the last lines
    const header = "<b>Status of the web pages:</b>"
    let content = "<p>";
    for( let i=0; i<status.length;i++) {
        content += status[i]['url'] + ": " + status[i]['status'] + "<p>";
    }
    res.send( header + content  )
})