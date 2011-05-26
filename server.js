#!/usr/local/bin/node

var fs   = require('fs'),
    http = require('http'),
	io   = require('socket.io'),
	path = require('path'),
	url  = require('url'),
	port = process.argv[2] || 8080;

mime = {
	'css': 'text/css', 
	'html':'text/html', 
	'js':  'text/javascript'
}

var server = http.createServer(function(req, res) {
	file = req.url.slice(1)||'index.html';

	fs.readFile(file, function(err, data){
		if (err){
			res.writeHead(404);
			res.end('404: Not Found');
			console.log('Error reading [' + file + ']');
		} else {
			res.writeHead(200, {'Content-Type':
				mime[file.slice(file.lastIndexOf('.')+1)]});
			res.end(data);
		}
	});
});
server.listen(parseInt(port,10));

console.log('Server running at http://localhost:'+port)

var socket = io.listen(server);
socket.on('connection', function (client){
	console.log('connected to client');

	client.on('message', function(data){
		console.log('server received: ' + data);
		socket.broadcast(data);
		//TODO: Use data to affect hardware
	});

	client.on('disconnect', function(){
		console.log('connection closed');
	});
});


