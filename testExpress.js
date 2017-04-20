var express = require('express');
var app = express();

var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });


mongoose.Promise = require('bluebird');
var connection_options = {server : {auto_reconnect: true}, user: 'admin', pass: 'castellano100'};
db = mongoose.connect('ds149820.mlab.com', 'search_engine_3', 49820, connection_options, function(error){
	if (!error){
		console.log('Conectando a la base de datos');
	} else {
		console.log('Error al conectar: ' + error);
	}
});


app.use(express.static('public'));

app.post('/middle1', parseUrlencoded, function(request, response) {
	var recibidos = request.body;

	console.log(recibidos.user + ' + ' + recibidos.pass);
	response.json('Datos de login recibidos');

	db.users.find({}, function(err, docs){
		if (!err){
			response.send(docs);
		} else {
			console.log('Fuck' + err);
		}
	});

	// console.log('Collections = '+db.collection.count());
});

app.post('/middle2', parseUrlencoded, function(request, response) {
	var recibidos = request.body;
	console.log(recibidos.nick + ' + ' + recibidos.user + ' + ' + recibidos.pass);
	response.json('Datos de signup recibidos');
});


app.listen(8080, function(){
	console.log('Escuchando el puerto 8080');
});