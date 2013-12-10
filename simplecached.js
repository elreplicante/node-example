var net = require('net');
var port = 11311;
var escape = "\r\n"
var map = {};

var executeSetCommand = function(command, connection){
    if (command.length == 3) {
        map[command[1]] = command[2];
        connection.write('STORED ' + JSON.stringify(map) + escape);
    } else {
        connection.write('NOT_STORED' + escape);
    }
};

var executeGetCommand = function(command, connection){
    if (command.length == 2) {
        var value = String(map[command[1]]);
        connection.write('VALUE [' + value + ']' + escape);
    } else {
        connection.write('ERROR' + escape);
    }
};

var executeDeleteCommand = function(command, connection){
    if (command.length == 2) {
        var value = String(map[command[1]]);
        console.log(value);
        connection.write('VALUE [' + value + ']' + escape);
    } else {
        connection.write('END' + escape);
    }
};

var server = net.createServer(function(connection) {
    console.log('Connection open');
    connection.write('$');
    connection.on('data', function(data) {
    var command = String(data).trim().split(' ');
    
    if (command[0] == 'set') {
        executeSetCommand(command, connection);
    }

    if (command[0] == 'get') {
        executeGetCommand(command, connection);
    }

    if (command[0] == 'delete') {
        var key = command[1];
        delete map[key];
        connection.end('BYE BYE' + escape);
    }

    if (command[0] == 'quit') {
        connection.end('BYE BYE' + escape);
    }

    });
});

server.listen(port);