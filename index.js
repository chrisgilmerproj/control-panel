var socket = new io.Socket('localhost',{'port':8080});
var last = '';
socket.connect();

//socket.on('connect', function(){
//    console.log('connected to server');
//});

socket.on('message', function(data){ 
	//console.log('message received: ' + data);
	if(last == '') {
		last = data;
		$('#'+data).addClass('active');
	} else {
		$('#'+last).removeClass('active');
		last = '';
	}
});

//socket.on('disconnect', function(){
//    console.log('disconected');
//});

$('.button').mousedown(function(){
	socket.send($(this).attr("id"));
});

$('.button').mouseup(function(){
	socket.send('stop');
});
