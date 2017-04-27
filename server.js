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

// FOR HEROKU DEPLOY
var port = process.env.PORT || 3000;

// VARIABLES
var MaxNumberOfUsers = 10;

// CONNECTION DATA BASE
mongoose.Promise = require('bluebird');
var connection_options = {server : {auto_reconnect: true}, user: 'admin', pass: 'castellano100'};
db = mongoose.connect('ds149820.mlab.com', 'search_engine_3', 49820, connection_options, function(error){
	if (!error){
		console.log('Se ha establecido conexión con la base de datos');
	} else {
		console.log('Error conenctando: ' + error);
	}
});

//SESSIONS
app.use(session({secret: 'idSession',resave: true, saveUninitialized: true}));
var sess;

app.use(express.static('public'));


//------GETS-------------//

//GET THE USER NAME
app.get('/nombre', function(request, response){
	sess = request.session;
	response.send({nicknameUser: sess.user});
	console.log('______________________________________________________');
	console.log("Usuario conectado :" + sess.user);
});

//GET THE CONNECTED USERS
app.get('/users', function(request, response){

	User.find().count(function(err,count){
		console.log("Número de usuarios conectados: " + count);   
		User.find().select('nickname').exec(function(err,doc){
			var array=[];
			for(var i=0;i<count;i++){
				array[i]=doc[i].nickname;
		}
		console.log("Los usuarios conectados son: " + array);
		response.json({info:array});
		});
	});
});

app.get('/mensajes', function(request, response){

	NewMessageChat.find().count(function(err,count){
		console.log("Número de mensajes almacenados :"+ count);   

		NewMessageChat.find().exec(function(err,doc){
			var array=[];
			var array2=[];
			for(var i=0;i<count;i++){
				array[i]=doc[i].nickname; 
				array2[i]=doc[i].message;
			}
			// console.log('Lista de mensajes:'+ array + array2 );
			response.json({nickname:array, messages:array2, count:count});
		});
	});
});


app.post('/login', parseUrlencoded, function(request, response) {

	var nicnknameUser= request.body.user;

    console.log("User "+ request.body.user);

    sess = request.session;
	
	console.log('___________________LOG IN_____________________________');
	console.log("Nombre de usuario recibido: " + nicnknameUser);
	

	//BUSCAMOS TODOS LOS USUARIOS
	User.find().count(function(error_find_count, count) {

		// FORMA DE LOS DATOS DE VUELTA AL CLIENTE
		//  [UsuarioAlmacenado, nicknameOcupado] -> puede ser true o false
		//  1-> error general, 2->nickname ocupado, 3->más de 10 usuarios, 4->correcto
		if (error_find_count) {
						// error en la búsqueda
			response.json([1]);
			console.log('Error al buscar todos los usuarios:' + error_find_count);
			console.log('______________________________________________________');
		} else {
				// si hay más de 10 usuarios conectados
			if (count >= MaxNumberOfUsers) {
				console.log('Hay 10 usuarios conectados, límite superado');
				response.json([3]);
				console.log('______________________________________________________');

			} else {
				// No hay 10 usuarios conectados vamos a comprobar que el nickname no esté ocupado
				User.find({nickname: nicnknameUser}, function(error_find,docs) {
				console.log('Hay menos de 10 usuarios conectados');

					if (error_find) {
						//error en la búsqueda
						response.json([1]);
						console.log('Error al buscar el nickname del usuario:' + error_find);
						console.log('______________________________________________________');
					} else if (docs.length == 0) {

						// Nickname libre, almacenamos el usuario
						console.log('Nickname libre, almacenando usuario...');
						var insert_user = new User({nickname: nicnknameUser});
						insert_user.save(function(error) {
						
							if (!error) {
								//almacenamiento correcto
								//asignamos el campo nombre de la sesión con el nicknameUSer
								sess.user=nicnknameUser;
								response.json([4, nicnknameUser]);
								console.log('...usuario almacenado');
								console.log('______________________________________________________');
							} else {
								//error al almacenar
								response.json([1]);
								console.log('Error al almacenar el usuario:' + error);
								console.log('______________________________________________________');
							}
						});
						
					} else {
						// Existe el usuario
						response.json([2, nicnknameUser]);
						console.log('Nickname ocupado');
						console.log('______________________________________________________');
					}
				});

			}
		}
	});

});

server.listen(port, function(){
	console.log('Escuchando en el puerto 8050');
});

//HAY QUE HACER QUE SE BORREN LOS USUARIOS Y LOS MENSAJES SI ACASO
// process.on('SIGINT', function(){
// 	User.remove({ }, function(error_delete,docs) {
// 		if(!error_delete){
// 			console.log("Usuario elimnado correctamente");
// 		}else{
// 			console.log("Error al eliminar al usuario:" +error_delete);
// 		}
// 	});
// 	process.exit();
// });

//------------------SOCKET------------------------------// 
io.on('connection', function(client) {


	client.on('send-nickname', function(nickname) {
		client.nickname = nickname;
		console.log('client.nickname: '+client.nickname);
	});

	client.on('chatMessages', function (data) {

		var NewMessage = new NewMessageChat({
			nickname: data.nickname,
			message: data.message,
			date: new Date
		});

		NewMessage.save(function(err){
			if(!err){
				console.log('Mensaje almacenado correctamente');
			} else {
				console.log('Error al almacear el mesanje');
			}
		});

		client.broadcast.emit('chatMessages', data);
		client.emit('chatMessages', data);
	});

	client.on('join', function(name) {
		client.nickname = name;
		// console.log('Se ha unido: ' + client.nickname);
		client.broadcast.emit('join',{info:'Se ha unido: ' + client.nickname});
	});

	client.on('addUser', function(name){
		client.nickname = name;
		client.broadcast.emit('addUser',{user:client.nickname});
		//client.emit('añadiruser',{usuario:client.nickname});
	});

	client.on('writing', function(name){
		client.nickname=name;
		client.broadcast.emit('writing',{user:client.nickname});
	});

	client.on('notWriting', function(name){
		client.nickname=name;
		client.broadcast.emit('notWriting',{user:client.nickname});
	});

	client.on('disconnect', function() {
		console.log('Se ha desconectado: ' + client.nickname);
		client.broadcast.emit('disconnection', {info:'El usuario '+client.nickname+' ha abandonado la sala'});
		client.broadcast.emit('removeFromList',{user: client.nickname});
		User.remove({nickname: client.nickname}, function(error_delete,docs) {

			if(!error_delete){
				console.log("Usuario elimnado correctamente");
			}else{
				console.log("Error al eliminar al usuario:" +error_delete);
			}
		});
	});

	client.on('removeFromList', function(nombre) {
		client.broadcast.emit('removeFromList',{user: userclient.nickname}); 
	});

	
});