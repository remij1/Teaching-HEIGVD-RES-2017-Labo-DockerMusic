/*
    Constants
*/
const MULTICAST_IP = "237.0.0.10";
const MULTICAST_PORT = "8787";

const SOUNDS = {
    'piano': 'ti-ta-ti',
    'trumpet': 'pouet',
    'flute': 'trulu',
    'violin': 'gzi-gzi',
    'drum': 'boum-boum'
};

/*
    Includes
 */
var net = require('net');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var uuidV4 = require('uuid/v4');

var instrument = {
    'instrument': process.argv[2],
    'uuid' : uuidV4(),
    'sound': SOUNDS[process.argv[2]]
};


setInterval(sendMessage, 1000);

function sendMessage() {
    var soundMessage = new Buffer(JSON.stringify(instrument));
    server.send(soundMessage, 0, soundMessage.length, MULTICAST_PORT, MULTICAST_IP, function (err, bytes) {
        if (err) throw err;
        console.log(soundMessage + ' sent to ' + MULTICAST_IP + ':' + MULTICAST_PORT);
    });
}

