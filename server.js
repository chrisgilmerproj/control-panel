#!/usr/local/bin/node

var fs   = require('fs'),
    http = require('http'),
	io   = require('socket.io'),
	path = require('path'),
	url  = require('url'),
	port = process.argv[2] || 8080;

var server = http.createServer(function(req, res) {
	
	var uri      = url.parse(req.url).pathname,
	    filename = path.join(process.cwd(), uri);

	path.exists(filename, function(exists) {

		if(!exists) {
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write("404 Not Found\n");
			res.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				res.writeHead(500, {'Content-Type': 'text/html'});
				res.write(err + "\n");
				res.end();
				return;
			}

		res.writeHead(200);
		res.write(file, "binary");
		res.end();
		});
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


