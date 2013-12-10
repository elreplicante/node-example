var net = require('net');
var port = 1702;
var escape = "\r\n"

var server = net.createServer(function(connection) {
    console.log('Connection open');
    connection.write('Hello?' + escape);
    connection.on('data', function(data) {
        if (String(data).trim() != 'hello') {
            connection.write('ERROR' + escape);
        } else {
            connection.end('world' + escape);
            console.log('Connection closed' + escape);
        }
    });
});
server.listen(port);