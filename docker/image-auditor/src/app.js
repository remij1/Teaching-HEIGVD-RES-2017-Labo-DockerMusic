/*
    Constants
*/
const MULTICAST_IP = "237.0.0.10";
const MULTICAST_PORT = "8787";


/*
    Includes
 */
var net = require('net');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);

    server.setBroadcast(true);
    server.setMulticastTTL(128);
    server.addMembership(MULTICAST_IP);
});


server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
});

server.bind(MULTICAST_PORT);


