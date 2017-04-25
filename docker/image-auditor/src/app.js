/*
    Constants
*/
const MULTICAST_IP = "237.0.0.10";
const MULTICAST_PORT = "8787";
const TCP_PORT = '2205';

/*
    Includes
 */
var net = require('net');
var dgram = require('dgram');
var udpListener = dgram.createSocket('udp4');
var tcpServer = net.createServer();


var instruments = new Map();

/* UDP SIDE */
udpListener.on('listening', function () {
    var address = udpListener.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);

    udpListener.setBroadcast(true);
    udpListener.setMulticastTTL(128);
    udpListener.addMembership(MULTICAST_IP);
});


udpListener.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);

    var curDate = new Date();

    var instrument = JSON.parse(message);
    if (!instruments.has(instrument.uuid)) { //If we haven't seen the instrument yet, we add it
        instrument.activeSince = curDate;
        delete instrument.sound;
        instruments.set(instrument.uuid, instrument);
    }


    // We update the date at wich we seen the instrument for the last time
    instruments.get(instrument.uuid).lastSeen = curDate;
    instrument.lastSeen = curDate;

    console.log(instruments.values());
    
});

udpListener.bind(MULTICAST_PORT);

/* TCP SIDE */

tcpServer.on('connection', function (socket) {

    var curInstruments = [];

    instruments.forEach((value) => {
        var curInstrument = {};
        curInstrument.uuid = value.uuid;
        curInstrument.instrument = value.instrument;
        curInstrument.activeSince = value.activeSince.toISOString();
        curInstruments.push(curInstrument);
    });


    console.log(instruments.values());

    var buffer = new Buffer(JSON.stringify(curInstruments) + "\n");
    socket.write(buffer);
    socket.destroy();
});

tcpServer.on('listening', function () {
    console.log('TCP Server listening on ' + tcpServer.address().address + ' : ' + tcpServer.address().port);
});

tcpServer.listen(TCP_PORT);

//Every second, we clean the list of musician every second
setInterval(checkInstruments, 1000);

function checkInstruments() {
    //The timeout is set to be about 5 second
    var lastDate = new Date() - 5000;
    instruments.forEach((value) => {
        if (value.lastSeen < lastDate) {
            instruments.delete(value.uuid);
        }
    });
}