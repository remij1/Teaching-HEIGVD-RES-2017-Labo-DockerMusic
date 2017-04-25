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

if (process.argv.length != 3)
    throw "1 argument is necessary";


var instrument = {
    'instrument': process.argv[2],
    'uuid' : uuidV4(),
    'sound': SOUNDS[process.argv[2]]
};

if (instrument.sound == null) {
    throw "This instrument does not exist";
}

// We send information every second
setInterval(sendMessage, 1000);

function sendMessage() {
    var soundMessage = new Buffer(JSON.stringify(instrument));
    server.send(soundMessage, 0, soundMessage.length, MULTICAST_PORT, MULTICAST_IP, function (err, bytes) {
        console.log(soundMessage + ' sent to ' + MULTICAST_IP + ':' + MULTICAST_PORT);
        if (err) throw err;
    });
}

