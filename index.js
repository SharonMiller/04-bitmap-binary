'use strict'

let args = process.argv;

if (args.length < 5) {
  throw new Error('--ERROR--\nusage: node index.js <input-file> <outbput-file> <transform-name>');
}
let inputFile = args[2];
let outputFile = args[3];
let transform = args[4]

console.log(inputFile); //arg passed by user
console.log(outputFile);
console.log(transform);

let message = `Using ${transform} on ${inputFile} and saving to ${outputFile}`;

console.log(message);

/* WORKER */
const Event = require('events').EventEmitter;
const ee = new Event();
const BMT = require('./lib/bmt.js');
let bmt = new BMT();

bmt.open(inputFile, (err, bitmap) => {
  if (err) throw err;

  ee.emit('fileLoaded', bitmap);
});

ee.on('fileLoaded', (bitmap) => {
  console.log(bitmap);
  bmt.invert(bitmap, (err, bitmap) => {
    if(err) throw err;

    ee.emit('transformed', bitmap);
  });
});

ee.on('transformed', (bitmap) => {
  bmt.save(bitmap, outputFile, (err, data) => {
  if(err) throw err;
    console.log('File transformed and saved successfully!');
  })
})