/* 
    Reads file line by line
*/

// Other files
const config = require('./config.json')

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


//app.get('/', function (req, res) {
//  res.send('Hello World!')
//})
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: `results.log`,
      //timestamp: tsFormat,
      level: 'info',
      prepend: true

    })
  ]
});

//app.listen(3000, function () {
//  console.log('Example app listening on port 3000!')
//})

/*app.post('/', function (req, res) {
    var parsed_url = url.format({
        query: {
        q: req.body.text
        }
    });
    res.send('Web page status: ' + parsed_url );
});*/

let readline = require('readline')
let inputFile = fs.createReadStream('links.txt')
var lines;

const rl = readline.createInterface({
    input: inputFile,
    output: process.stdout
});


// Takes array of addresses to go though all
function goThrough( input ) {

    console.log( "input: " + input )

    let element = input.split(' ', 1).toString()
    let info = input.split(' ', 2)[1];

    var opts = {
        url: element,
        timeout: 10000
    }
    
    var start = new Date();     // timer set

    request.get(opts, function (err, res, body) {

        var responseTime = new Date() - start;
        console.log( responseTime );
        // Get the content type
        let contenttype = res.headers['content-type'];
        // Compare that the line exists in content-type
        if (contenttype.includes(info))
            console.log("Type matches")
        if (err)
            console.log(err);
        if (res.statusCode === 200) {
            console.log("Page OK");
            console.log(res.statusCode);
        }

        // logging
        logger.info( input + " " + res.statusCode + " " + responseTime )

    });
}

rl.on('line', (input) => {    
    // make timed interval
    setInterval( goThrough, config.waittime, input);
});

