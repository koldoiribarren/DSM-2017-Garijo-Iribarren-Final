$(window).on("load", function() {

	// Establish the connection with the socket
	var socket = io.connect(); //'http://localhost:3000'

	emojify.run();

	// We assign a new 'on' event to the socket using the name of the new communication, 
	// and define the callback function that acts when the information arrives.
	socket.on('connect', function(data){

		$.get("/nombre",function(data){
			nickname = data.nicknameUser;
			socket.nickname = nickname;
			// Inform the server that a new user has been connected
			socket.emit('join', nickname);
			socket.emit('addUser', nickname);
			socket.emit('send-nickname', nickname);
		});

		$.get("/users",function(data){

			$("#user_list").empty();
			for (var i = 0; i < data.info.length; i++) {
				if(socket.nickname == data.info[i]){
					$('#user_list').append('<li class="selfUser" id="'+data.info[i]+'">'+data.info[i]+'</li>');
				} else {
					$('#user_list').append('<li class="otherUser" id="'+data.info[i]+'">'+data.info[i]+'</li>');
				}
				// $('#user_list').append('<li class="userList" id="'+data.info[i]+'">'+data.info[i]+'</li>');
			};
			$("#user_list_header").empty();
			for (var i = 0; i < data.info.length; i++) {
				if(socket.nickname == data.info[i]){
					$('#user_list_header').append('<li class="selfUser" id="'+data.info[i]+'_header">'+data.info[i]+'</li>');
				} else {
					$('#user_list_header').append('<li class="otherUser" id="'+data.info[i]+'_header">'+data.info[i]+'</li>');
				}
				// $('#user_list_header').append('<li class="userList" id="'+data.info[i]+'_header">'+data.info[i]+'</li>');
			};

		});

		$.get("/mensajes",function(data){

			//Mostar unicamente 20 mensajes antiguos 
			if(data.count>20){
				for (var i = data.count-20; i < data.count; i++) {
					$('#message_board').append('<p class="oldMessages">'+data.nickname[i]+": "+emojify.replace(data.messages[i])+'</p>');
				};
			} else {
				for (var j = 0; j < data.count; j++) {
					$('#message_board').append('<p class="oldMessages">'+data.nickname[j]+": "+emojify.replace(data.messages[j])+'</p>');
				};
			}	
		}); 
	});

	socket.on('chatMessages', function(data) {
		if(socket.nickname == data.nickname){
			$('#message_board').append('<p class="selfMessagesP"><span class="selfMessages">'+data.nickname+':</span> '+emojify.replace(data.message)+'</p>');
		} else {
			$('#message_board').append('<p class="otherMessagesP"><span class="otherMessages">'+data.nickname+':</span> '+emojify.replace(data.message)+'</p>');
		}
		var $content = $('.viewport');
		$content.scrollTop(10000000);
	});

	socket.on('join',function(data){
		$('#message_board').append('<p class="infoMessages">---'+data.info+'---</p>');
		var $content = $('.viewport');
		$content.scrollTop(10000000);
	});

	socket.on('addUser',function(data){
		if(socket.nickname == data.user){
			$('#user_list').append('<li class="selfUser" id="'+data.user+'">'+data.user+'</li>');
			$('#user_list_header').append('<li class="selfUser" id="'+data.user+'_header">'+data.user+'</li>');
		} else {
			$('#user_list').append('<li class="otherUser" id="'+data.user+'">'+data.user+'</li>');
			$('#user_list_header').append('<li class="otherUser" id="'+data.user+'_header">'+data.user+'</li>');
		}
		// $('#user_list').append('<li class="userList" id="'+data.user+'">'+data.user+'</li>');
		// $('#user_list_header').append('<li class="userList" id="'+data.user+'_header">'+data.user+'</li>');

	});

	socket.on('writing',function(data){
		document.getElementById(data.user).innerHTML=data.user+' escribiendo...';
		document.getElementById(data.user+'_header').innerHTML=data.user+' escribiendo...';

	});

	socket.on('notWriting',function(data){
		document.getElementById(data.user).innerHTML=data.user;
		document.getElementById(data.user+'_header').innerHTML=data.user;
	});

	socket.on('disconnection',function(data){
		$('#message_board').append('<p class="infoMessages">---'+data.info+'---</p>');
		var $content = $('.viewport');
		$content.scrollTop(10000000);
	});

	socket.on('removeFromList',function(data){
		document.getElementById(data.user).remove();
		document.getElementById(data.user+'_header').remove();

	});

	//--------END SOCKET----------------------------------------//

	$('#messageFormu').on('submit', function(e){
		e.preventDefault();
		var NewMessage = $('#send_message').val();
		$('#send_message').val('');
		if(NewMessage != "" ){
			$.get("/nombre",function(data){
				nickname=data.nicknameUser;
				socket.emit('chatMessages', {message: NewMessage, nickname: nickname});//usuario:
			});
		}
	});

	$('#logout_button').on('click', function(e){
		e.preventDefault();
		socket.emit('disconnect');
		window.location='/';
	});

	var isWriting = false;

	$('#send_message').on('focusin', function(event){ 
		if(!isWriting && !($('#send_message').val() == '')){
			$.get("/nombre",function(data){
				nombre=data.nicknameUser;         
				socket.emit('writing', nombre);
				isWriting = true;
			});
		}
	});

	$('#send_message').on('focusout', function(event){ 
		if(isWriting){
			$.get("/nombre",function(data){
				nombre=data.nicknameUser;         
				socket.emit('notWriting', nombre);
				isWriting = false;
			});
		}
	});

	$('#send_message').on('keyup', function(event) {
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