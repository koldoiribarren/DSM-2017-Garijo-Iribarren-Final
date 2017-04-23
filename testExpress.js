var express = require('express');
var app = express();

var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });


mongoose.Promise = require('bluebird');
var connection_options = {server : {auto_reconnect: true}, user: 'admin', pass: 'castellano100'};
db = mongoose.connect('ds149820.mlab.com', 'search_engine_3', 49820, connection_options, function(error){
	if (!error){
		console.log('Connecting to database');
	} else {
		console.log(' Error connecting ' + error);
	}
});


app.use(express.static('public'));

app.post('/middle1', parseUrlencoded, function(request, response) {
	var received = request.body;

	console.log(reveived.user);
	response.json('Login data received');

	
});

app.post('/middle2', parseUrlencoded, function(request, response) {
	var received = request.body;
	
	console.log(received.user + ' + ' + received.pass);
	response.json('Register data received');
});


app.listen(8080, function(){
	console.log('Listening on port 8080');
});