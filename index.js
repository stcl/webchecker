/* 
    Web monitoring app
*/

// Other files
const config = require('./config.json')
const logger = require('./logger.js')
const monitor = require('./monitor.js')
let State = require('./state.js')

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

let countObjects = 0;      // Count of the elements in file
let state = new State();

// Takes every line of the file
rl.on('line', (input) => {
    countObjects++
    // timed interval, might cause trouble if waits too long
    setInterval( monitor.makeRequest, config.waittime, input, function(res) {
        logger.add( res );
        // replace the old value with new status
        if( state.stateHasChanged(res) ) {
            state.replaceStatus(res)
        }   // otherwise just add to the state
        else if( state.getStatus().length < countObjects ) {
            state.addToState(res)
        }
    })
})

rl.on('close', (input) => {
    //count++;
    console.log( "\nend of file");
})

app.get('/', function (req, res) {
    // Print the last lines
    const header = "<b>Status of the web pages:</b>"
    let content = "<p>";
    const status = state.getStatus();
    for( let i=0; i<status.length;i++) {
        content += status[i]['url'] + ": " + status[i]['status'] + "<p>";
    }
    res.send( header + content  )
})