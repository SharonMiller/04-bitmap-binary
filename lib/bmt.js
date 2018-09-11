'use strict';

const fs = require('fs');

class BMT {
  constructor() {
    this.buf = null;
    this.fileHeaderBuf = null; //raw header
    this.infoHeaderBuf = null;
    this.fileHeader = null;
    this.infoHeader = null;

  }
/* async file system methods */
  open(file, callback) {
    fs.readFile(file, (err, data) => {
      if(err) callback(err);
      this.buf = data; 

      _parseBitmapBuffer(this);

      callback(null, this);
    });
  }
  //function called invert, grayscale, darken, lighten 
  transform(bitmap, transform, callback){
    console.log('inverting colors...');
    //transform the colors ... put the switch statement into here
    console.log('colors inverted!');
    callback(null, bitmap); 
  }
  save(bitmap, outPutFile, callback) {
  fs.writeFile(outPutFile, data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
    //Write transformed bitmap to disk
    //NOTE: trnasfomed colors might still be encoded, they need to be raw
    //NOTE: bitmap is not a buffer, but fs.writeFile takes a buffer.
    //take four indv buffers and concatinate them into one 
    callback(null);

    
  }
}

let _parseBitmapBuffer = function(self) {
  self.fileHeaderBuf = self.buf.slice(0, 14);
  self.fileHeader = {
    fileType: self.fileHeaderBuf.toString('ascii', 0, 2),
    fileSize: self.fileHeaderBuf.readUInt32LE(2),
    reserved: self.fileHeaderBuf.readUInt32LE(6),
    dataOffset: self.fileHeaderBuf.readUInt32LE(10)
  };
  //color pallete and raster data
  
  self.infoHeaderBuf = self.buf.slice(14, 54);
  self.infoHeader = {
    dibHeader: self.infoHeaderBuf.readUInt32LE(0),
    pixelWidth: self.infoHeaderBuf.readUInt32LE(4),
    pixelHeight: self.infoHeaderBuf.readUInt32LE(8),
    planes: self.infoHeaderBuf.readUInt16LE(12),
    bitPerPixel: self.infoHeaderBuf.readUInt16LE(14)
  };
//add color functions transform also work on save
};

module.exports = exports = BMT;