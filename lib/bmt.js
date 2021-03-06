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
      if (err) callback(err);
      this.buf = data;

      _parseBitmapBuffer(this);

      callback(null, this);
    });
  }
  //function called invert, grayscale, darken, lighten 
  invert(bitmap, callback) {
    bitmap.imageBuf = Buffer.from(Array.from(bitmap.imageBuf).map(bit => 255 - bit));
    //transform the colors 
    callback(null, bitmap);
  }

  bright(bitmap, callback) {
    bitmap.imageBuf = Buffer.from(Array.from(bitmap.imageBuf).map((bit, index) => {
      if (index % 3 !== 0) {
        return parseInt(bit);
      } else {
        return 0;
      }
    }));
    callback(null, bitmap);
  }

  finelines(bitmap, callback) {
    bitmap.imageBuf = Buffer.from(Array.from(bitmap.imageBuf).map((bit, index) => {
      if (index % 2 === 0) {
        return parseInt(bit);
      } else {
        return 1;
      }
    }));
    callback(null, bitmap);
  }
  bluelight(bitmap, callback) {
    bitmap.imageBuf = Buffer.from(Array.from(bitmap.imageBuf).map((bit, index) => {
      if (index % 3 === 0) {
        return parseInt(bit);
      } else {
        return 1;
      }
    }));
    callback(null, bitmap);
  }

  save(outPutFile, bitmap, callback) {
    let buf = Buffer.concat([bitmap.fileHeaderBuf, bitmap.infoHeaderBuf, bitmap.imageBuf]);
    fs.writeFile(outPutFile, buf, (err) => {
      if (err) throw err;
    });
    callback(null);

  }
}
//add a function to decide which one to 

let _parseBitmapBuffer = function (self) {
  self.fileHeaderBuf = self.buf.slice(0, 14);
  self.fileHeader = {
    fileType: self.fileHeaderBuf.toString('ascii', 0, 2),
    fileSize: self.fileHeaderBuf.readUInt32LE(2),
    reserved: self.fileHeaderBuf.readUInt32LE(6),
    dataOffset: self.fileHeaderBuf.readUInt32LE(10),
  };
  //color pallette and raster data

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
    numberImportantColors: self.infoHeaderBuf.readUInt32LE(36),
  };


  self.imageBuf = self.buf.slice(54);
};

module.exports = exports = BMT;