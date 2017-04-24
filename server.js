var express = require('express');
var app = express();

var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var session = require('express-session');

// ORM MODELS
var User = require('./ORM/ormStructUser.js');
var NewMessageChat = require('./ORM/ormStructMessage.js');

// VARIABLES
var MaxNumberOfUsers = 10;

// CONNECTION DATA BASE
mongoose.Promise = require('bluebird');
var connection_options = {server : {auto_reconnect: true}, user: 'admin', pass: 'castellano100'};
db = mongoose.connect('ds149820.mlab.com', 'search_engine_3', 49820, connection_options, function(error){
	if (!error){
		console.log('Connecting to database');
	} else {
		console.log(' Error connecting ' + error);
	}
});

//SESSIONS
app.use(session({secret: 'idSession',resave: true,
    saveUninitialized: true}));
var sess;

app.use(express.static('public'));



app.post('/login', parseUrlencoded, function(request, response) {

	// var received = request.body;
	// console.log('User ' + received.user + ' successfully logged in');
	// response.json('Login data received');
	var datos = request.body;
	
	console.log('___________________LOG IN_____________________________');
	console.log("Nombre de usuario recibido: " + datos.user);


	//BUSCAMOS TODOS LOS USUARIOS
	User.find().count(function(error_find_count, count) {

		// FORMA DE LOS DATOS DE VUELTA AL CLIENTE
		//  [UsuarioAlmacenado, nicknameOcupado] -> puede ser true o false
		if (error_find_count) {
						// error en la búsqueda
			response.json([false, false]);
			console.log('Error al buscar todos los usuarios:' + error_find_count);
			console.log('______________________________________________________');
		} else {
				// si hay más de 10 usuarios conectados
			if (count >= MaxNumberOfUsers) {
				console.log('Hay 10 usuarios conectados, límite superado');
				response.json([false, false]);

			} else {
				// No hay 10 usuarios conectados vamos a comprobar que el nickname no esté ocupado
				User.find({nickname: datos.user}, function(error_find,docs) {
				console.log('Hay menos de 10 usuarios conectados');

					if (error_find) {
						//error en la búsqueda
						response.json([false, false]);
						console.log('Error al buscar el nickname del usuario:' + error_find);
						console.log('______________________________________________________');
					} else if (docs.length == 0) {

						// Nickname libre, almacenamos el usuario
						console.log('Nickname libre, almacenando usuario...');
						var insert_user = new User({nickname: datos.user});
						insert_user.save(function(error) {
						
							if (!error) {
								//almacenamiento correcto
								response.json([true, false, datos.user]);
								console.log('...usuario almacenado');
								console.log('______________________________________________________');
							} else {
								//error al almacenar
								response.json([false, false]);
								console.log('Error al almacenar el usuario:' + error);
								console.log('______________________________________________________');
							}
						});
						
					} else {

						// Existe el usuario
						response.json([false, true, datos.user]);
						console.log('Nickname ocupado');
						console.log('______________________________________________________');
					}
				});

			}
		}
	});

});

// app.post('/goToChat', parseUrlencoded, function(request, response) {
// 	response.sendFile(__dirname + '/public/boards.html');
// });

app.post('/register', parseUrlencoded, function(request, response) {
	var received = request.body;
	
	console.log(received.user + ' + ' + received.pass);
	response.json('Register data received');
});


server.listen(8050, function(){
	console.log('Listening on port 8050');
});


//------------------SOCKET------------------------------// 
io.on('connection', function(client) {

	console.log('Cliente conectado...');

	client.on('unir', function(nombre) {
	    client.nickname = nombre;
	    console.log('Se ha unido: ' + client.nickname);
	    client.broadcast.emit('unir',{info:'Se ha unido: ' + client.nickname});
    
 	});

	
});