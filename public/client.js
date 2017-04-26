$(window).on("load", function() {

	// Establish the connection with the socket
	var socket = io.connect('http://localhost:8050');

	// We assign a new 'on' event to the socket using the name of the new communication, 
	// and define the callback function that acts when the information arrives.
	socket.on('connect', function(data){

	// socket.emit('unir', nickname);
		$.get("/nombre",function(data){
			nickname = data.nicknameUser;

			// Inform the server that a new user has been connected
			socket.emit('join', nickname);
			socket.emit('addUser', nickname);
			socket.emit('send-nickname', nickname);

			console.log("Nombre de usuario resien no más conectado: "+ nickname);
		});

		$.get("/users",function(data){
			$("#user_list").empty();
			for (var i = 0; i < data.info.length; i++) {
				//socket.emit('añadiruser', dato.info[i]);
				$('#user_list').append('<li class="userList" id="'+data.info[i]+'">'+data.info[i]+'</li>');
			};
		});

		$.get("/mensajes",function(data){

			//Mostar unicamente 10 mensajes antiguos 
			if(data.count>10){
				for (var i = data.count-10; i < data.count; i++) {
					$('#message_board').append('<p class="oldMessages">'+data.nickname[i]+": "+data.messages[i]+'</p>');
				};
			} else {
				for (var j = 0; j < data.count; j++) {
					$('#message_board').append('<p class="oldMessages">'+data.nickname[j]+": "+data.messages[j]+'</p>');
				};
			}	
		}); 
	});

	socket.on('chatMessages', function(data) {
	  //alert('Hay que meter esta info en el chat: ' + datos.info);
		if(socket.nickname == data.nickname){
			$('#message_board').append('<p class="otherMessages">'+data.nickname+": "+data.message+'</p>');
		} else {
			$('#message_board').append('<p class="selfMessages">'+data.nickname+": "+data.message+'</p>');
		}
		var $content = $('.viewport');
		$content.scrollTop(10000000);
	});

	socket.on('join',function(data){
		console.log("Nombre: " + data.info);
		$('#message_board').append('<p class="infoMessages">'+data.info+'</p>');
		var $content = $('.viewport');
		$content.scrollTop(10000000);
	});

	socket.on('addUser',function(data){
		//añadir los usuarios a la lista
		$('#user_list').append('<li class="userList" id="'+data.user+'">'+data.usuario+'</li>');

	});

	socket.on('writing',function(data){
		document.getElementById(data.usuario).innerHTML=data.user+' escribiendo...';
	});

	socket.on('notWriting',function(data){
		document.getElementById(data.usuario).innerHTML=data.user;
	});

	socket.on('disconnection',function(data){
		$('#message_board').append('<p class="other">'+data.info+'</p>');
		//borrar el <p> de la lista de contactos

		var $content = $('.ventana');
		$content.scrollTop(10000000);
	});

	socket.on('removeFromList',function(data){
		document.getElementById(data.user).remove();
	});

	//--------END SOCKET----------------------------------------//

	// $(document).ready(function() {
	//   //emoticonos
	//   $('#chatcomen').emojiPicker({
	//     //e.preventDefault();
	//     top: '0px',
	//     height: '200px',
	//     width:  '350px'

	//   });  
	//   $('.search').remove();
	//   $('.recent').remove();
	//   $('.shortcode').remove();

	$('#messageFormu').submit(function(e){
		e.preventDefault();
		var NewMessage = $('#send_message').val();

		console.log("MEnsaje enviado: "+NewMessage );
		// reestablecer el valor a cero
		$('#send_message').val('');
		if(NewMessage != "" ){
			$.get("/nombre",function(data){
				nickname=data.nicknameUser;
				socket.emit('chatMessages', {message: NewMessage, nickname: nickname});//usuario:
			});
		}
	});

	$('#logout_button').click(function(e){
		e.preventDefault();
		socket.emit('disconnect');
		window.location='/';
	});

	var isWriting = false;

	$('#send_message').focusin(function( event ){ 
		if(!isWriting && !($('#send_message').val() == '')){
			$.get("/nombre",function(data){
				nombre=data.nicknameUser;         
				socket.emit('writing', nombre);
				isWriting = true;
			});
		}
	});

	$('#send_message').focusout(function( event ){ 
		if(isWriting){
			$.get("/nombre",function(data){
				nombre=data.nicknameUser;         
				socket.emit('notWriting', nombre);
				isWriting = false;
			});
		}
	});

	$('#send_message').keyup(function( event ) {
		if (!isWriting && !($('#send_message').val() == '')){
			$.get("/nombre",function(data){

				nombre=data.nicknameUser;         
				socket.emit('writing', nombre);
			});
			isWriting = true;
		} else if(isWriting && $('#send_message').val() == ''){
			$.get("/nombre",function(data){
				nombre=data.nicknameUser;         
				socket.emit('notWriting', nombre);
				isWriting = false;
			});
		}
	});

});