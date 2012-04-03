var dgram = require("dgram");


var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    broadcast(msg);
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});

server.bind(8895);


/*
    TCP part
*/
var net     = require('net'),
    clients = [];

var tcpServer = net.createServer(function(sock) { //'connection' listener
    
    console.log('CLIENT CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    clients.push(sock);

    sock.on('close', function(data) {
        console.log('CLIENT DISCONNECTED: ' + sock.remoteAddress +' '+ sock.remotePort);
        // remove from clients list
        clients.splice(clients.indexOf(sock), 1);
    });

}).listen(8124);

/*
    Sends a message to each client 
*/
function broadcast(msg) {
    clients.forEach(function(clientSocket) {
        clientSocket.write(msg);
    });
}