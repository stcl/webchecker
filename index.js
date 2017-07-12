// Reads file line by line

let fs = require('fs')
let readline = require('readline')
let inputFile = fs.createReadStream('links.txt')

const rl = readline.createInterface({
   input: inputFile,
   output: process.stdout
});

rl.on('line', (input) => {
   let split = input.split(' ');
   console.log( input ) 
});