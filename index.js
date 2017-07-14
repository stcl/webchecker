// Reads file line by line

const express = require('express')
const app = express()

const url = require('url')
const request = require('request')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/', function (req, res) {
    var parsed_url = url.format({
        query: {
        q: req.body.text
        }
    });
    res.send('Web page status: ' + parsed_url );
});

let fs = require('fs')
let readline = require('readline')
let inputFile = fs.createReadStream('links.txt')
var lines;

const rl = readline.createInterface({
    input: inputFile,
    output: process.stdout
});

rl.on('line', (input) => {
    let split = input.split(' ', 1)
    console.log( split )
    lines = split;
    // check http

    lines.forEach(function(element) {
        request.get(element, function(err, res, body) {

            console.log( element );

            if( err )
                console.log( err );

            if (!err && res.statusCode === 200) {
                console.log("Page OK");
                console.log( element );
                console.log( res.statusCode );
            }
        });

    }, this);

});

