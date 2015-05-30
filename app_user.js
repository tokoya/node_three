var express = require('express');
var router = express.Router();
var i2c = require('i2c');
var addr = 0x1d;
var wire = new i2c(addr, {device: '/dev/i2c-1'});

function signed(n) {
  return (n < 128) ? n : n - 256; 
}

function app_i2c(server) {
  var io = require('socket.io')(server);
  wire.writeBytes(0x16, [0x05], function(err, res){});
  wire.writeBytes(0x10, [0,0,0,0,0,0], function(err, res){});
  setInterval(function() {
    wire.readBytes(0x06, 3, function(err, res){
      io.sockets.emit('event', {
        x: signed(res[0]),
        y: signed(res[1]),
        z: signed(res[2]),
      });
    });
  }, 100);
}

module.exports = app_i2c;
