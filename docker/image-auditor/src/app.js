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

    var instrument = JSON.parse(message);
    instruments.set(instrument.uuid, instrument);
});

udpListener.bind(MULTICAST_PORT);

/* TCP SIDE */

tcpServer.on('connection', function (socket) {

    var curInstruments = [];

    instruments.forEach((value) => {
        curInstruments.push(value);
    });


    console.log(instruments.values());

    var buffer = new Buffer(JSON.stringify(curInstruments));
    socket.write(buffer);
    socket.destroy();
});

tcpServer.on('listening', function () {
    console.log('TCP Server listening on ' + tcpServer.address().address + ' : ' + tcpServer.address().port);
});

tcpServer.listen(TCP_PORT);