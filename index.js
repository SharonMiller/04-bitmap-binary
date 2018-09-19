'use strict'

let args = process.argv;

if (args.length < 5) {
  throw new Error('--ERROR--\nusage: node index.js <input-file> <outbput-file> <transform-name>');
}
let inputFile = args[2];
let outputFile = args[3];
let transform = args[4];


let message = `Using ${transform} on ${inputFile} and saving to ${outputFile}`;


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
  if (transform === 'bright') {
    bmt.bright(bitmap, (err, bitmap) => {
      if (err) throw err;
      ee.emit('transformed', bitmap);
    });
    //run invert code
  } else if (transform === 'invert') {
    bmt.invert(bitmap, (err, bitmap) => {
      if (err) throw err;
      ee.emit('transformed', bitmap);
    });
  } else if (transform === 'finelines') {
    bmt.finelines(bitmap, (err, bitmap) => {
      if (err) throw err;
      ee.emit('transformed', bitmap);
    });
  } else if (transform === 'bluelight') {
    bmt.bluelight(bitmap, (err, bitmap) => {
      if (err) throw err;
      ee.emit('transformed', bitmap);
    });
  }
});


ee.on('transformed', (bitmap) => {
  bmt.save(outputFile, bitmap, (err, bitmap) => {
    if (err) throw err;
  });
});
