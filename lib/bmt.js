'use strict';

const fs = require('fs');

class BMT {
  constructor() {
    this.buf = null;
    this.fileHeaderBuf = null; //raw header
    this.infoHeaderBuf = null;
    this.fileHeader = null;
    this.infoHeader = null;
    this.imageBuf = null;

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
  invert(bitmap, callback){
    console.log('inverting colors...');
    console.log(bitmap.imageBuf);
    bitmap.imageBuf = Buffer.from(Array.from(bitmap.imageBuf).map(bit => 255 - bit));
    console.log(bitmap.imageBuf);
    //transform the colors ... put the switch statement into here
    console.log('colors inverted!');
    callback(null, bitmap); 
  }

  bright(bitmap, callback){
    console.log('brightening colors');
    console.log(bitmap.imageBuf);
    bitmap.imageBuf = Buffer.from(Array.from(bitmap.imageBuf).map((bit, index) => {
      if (
      index % 3 !==0) {
        return parseInt(bit);
      } else {
        return 0;
      }
    } ));
    console.log(bitmap.imageBuf);
    //transform the colors ... put the switch statement into here
    console.log('colors brightened!');
    callback(null, bitmap); 
  }
  
  save(outPutFile, bitmap, callback) {
    let buf = Buffer.concat([bitmap.fileHeaderBuf, bitmap.infoHeaderBuf, bitmap.imageBuf]);
    console.log(bitmap.imageBuf); 
    fs.writeFile(outPutFile, buf, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
});
callback(null);   
    //NOTE: transfomed colors might still be encoded, they need to be raw
    //NOTE: bitmap is not a buffer, but fs.writeFile takes a buffer.
    //take four indv buffers and concatinate them into one 
    // fs.writeFile(outputFile, buf, (err) => {
    //   if (err) throw err; is this correct???
    // });

    
  }
}
//add a function to decide which one to 

let _parseBitmapBuffer = function(self) {
  self.fileHeaderBuf = self.buf.slice(0, 14);
  self.fileHeader = {
    fileType: self.fileHeaderBuf.toString('ascii', 0, 2),
    fileSize: self.fileHeaderBuf.readUInt32LE(2),
    reserved: self.fileHeaderBuf.readUInt32LE(6),
    dataOffset: self.fileHeaderBuf.readUInt32LE(10)
    //reasterdata offset starts
  };
  //color pallete and raster data
  
  self.infoHeaderBuf = self.buf.slice(14, 54);
  self.infoHeader = {
    dibHeader: self.infoHeaderBuf.readUInt32LE(0),
    pixelWidth: self.infoHeaderBuf.readUInt32LE(4),
    pixelHeight: self.infoHeaderBuf.readUInt32LE(8),
    planes: self.infoHeaderBuf.readUInt16LE(12),
    bitPerPixel: self.infoHeaderBuf.readUInt16LE(14),
    compressionMethod: self.infoHeaderBuf.readUInt32LE(16),
    imageSize: self.infoHeaderBuf.readUInt32LE(20),
    horizontalRes: self.infoHeaderBuf.readUInt32LE(24),
    verticalRes: self.infoHeaderBuf.readUInt32LE(28),
    numberColors: self.infoHeaderBuf.readUInt32LE(32),
    numberImportantColors: self.infoHeaderBuf.readUInt32LE(36)
  };
//add color functions transform also work on save
//what does this do???
// if(self.fileHeader.dataOffset === 54) { 
// //no color table
// } else {//color table present from 54 to dataOffset, raster follows until EOF (end of file)
// }

self.imageBuf = self.buf.slice(54);
};

module.exports = exports = BMT;