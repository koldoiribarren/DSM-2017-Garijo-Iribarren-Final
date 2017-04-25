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
	      $('#user_list').append('<li class="listausuariosx" id="'+data.info[i]+'">'+data.info[i]+'</li>');
	    };
	  });

	  $.get("/mensajes",function(data){

	  	//Mostar unicamente 10 mensajes antiguos 
	    if(data.count>10){
	      for (var i = data.count-10; i < data.count; i++) {
	        $('#message_board').append('<p class="messageOnBoard">'+data.nickname[i]+": "+data.messages[i]+'</p>');
	      };
	    }else{
	      for (var j = 0; j < data.count; j++) {
	        $('#message_board').append('<p class="messageOnBoard">'+data.nickname[j]+": "+data.messages[j]+'</p>');
	      };
	    }
	   }); 

});


		socket.on('unir',function(datos){
			console.log("Nombre: " + datos.info);
			  $('#message_board').append('<p class="user">'+datos.info+'</p>');

			  // var $content = $('.ventana');
			  // $content.scrollTop(10000000);
		});


		socket.on('mensajeschat', function(data) {
		  //alert('Hay que meter esta info en el chat: ' + datos.info);

		  if(socket.nickname==data.nickname){
		    $('#message_board').append('<p class="partex">'+data.usuario+": "+data.info+'</p>');
		  }else{
		    $('#message_board').append('<p class="partex2">'+data.usuario+": "+data.info+'</p>');
		  }
		  var $content = $('.ventana');
			$content.scrollTop(10000000);
		});

		socket.on('unir',function(datos){
		  $('#message_board').append('<p class="user">'+datos.info+'</p>');

		  var $content = $('.ventana');
		  $content.scrollTop(10000000);
		});

		socket.on('addUser',function(datos){
		  //añadir los usuarios a la lista
		  $('#user_list').append('<li class="listausuariosx" id="'+datos.usuario+'">'+datos.usuario+'</li>');

		});

		socket.on('escribiendo',function(datos){
		  document.getElementById(datos.usuario).innerHTML=datos.usuario+' escribiendo...';
		});

		socket.on('noescribiendo',function(datos){
		 document.getElementById(datos.usuario).innerHTML=datos.usuario;
		});

		socket.on('desconectar',function(data){
		  $('#message_board').append('<p class="user">'+data.info+'</p>');
		  //borrar el <p> de la lista de contactos
		  
		  var $content = $('.ventana');
		  $content.scrollTop(10000000);
		});

		socket.on('quitarlista',function(data){
		  document.getElementById(data.user).remove();
		});

		//--------END SOCKET----------------------------------------//


// };

// $(document).ready(function() {

	$('#pass_bool').on('change', function(){
		if ($('#pass_bool').is(':checked')){
			alert('on');
		} else if (!$('#pass_bool').is(':checked')){
			alert('off');
		}
	});

	// En login.js
	// $('#login_form').on('submit', function(event) {
	// 	event.preventDefault();
	// 	var form = $(this);
	// 	var formData = form.serialize();
	// 	console.log(formData);

	// 	//COMPROBAMOS QUE EL CAMPO NO ESTÉ VACÍO 
	// 	if(document.getElementById("inputUser").value == ""){

	// 		confirm("Debe introducir un nombre de usuario");

	// 	}else{

	// 		$.ajax({type: 'POST', url: '/login', data: formData}).done(function(data){
	// 			// console.log(formData);
	// 			// console.log(data);
	// 			form.trigger('reset');
				
	// 			// STORED USER 
	// 			 if (data[0] == true || data[1] == false){
				 	
	//                 alert("Has elegido "+ data[2] + " como nombre de usuario.");

	//                 window.location.replace("http://localhost:8050/boards.html"); 

	//             	// $.ajax({type: 'POST', url: '/goToChat'}).done(function(data){
	//             	// 	console.log("Redireccionando al chat");
	//             	// });
				 	

	// 			 // BUSY NICKNAME
	// 			 } else if(data[0] == false || data[1] == true){
				 	
	// 			 	 alert("El nombre de usuario que tratas de usar: "+ data[2] + ", está ocupado, utiliza otro.");			

	// 			 }else{

	//                 alert("Estamos teniendo problemas con la base de datos, intentelo de nuevo más tarde.");
	               	               
	// 			 }

	// 		});
	// 	}
	// });

	$('#register_form').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var formData = form.serialize();
		alert(formData);
		$.ajax({type: 'POST', url: '/register', data: formData}).done(function(data){
			console.log(data);
			form.trigger('reset');
		});
	});





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
  // $('#MessageButton').on('click',function(e){
    	e.preventDefault();
      var NewMessage = $('#send_message').val();
      
      console.log("MEnsaje enviado: "+NewMessage );
     // reestablecer el valor a cero
      $('#send_message').val('');
      
      if(NewMessage != "" ){

        $.get("/nombre",function(data){
       	 nickname=data.nicknameUser;
       	 socket.emit('mensajeschat', {message: NewMessage, nickname: nickname});//usuario:
      	});
      }      
});


//   $('#btnsalir').on('click',function(e){
//     e.preventDefault();
//    // nombre="meloinventoaliciasalir";
//     $.get("/nombre",function(data){
//       nombre=data.usuario;
//       socket.emit('disconnect',nombre);
//       socket.emit('quitarlista',nombre);
//     });
//     $.get("/logout",function(datos){
//     //,{name: datos.user}
//     //alert("ok");
//       if(datos.info=='ok'){
//         window.location='/';
//       }
//     });
//   });

// //deje de poner escribiendo
// $( "#chatcomen" ).focusout(function( event ){  
//   $.get("/nombre",function(data){
//         nombre=data.usuario;         
//         socket.emit('noescribiendo', nombre);
 
//   });
// });
// //poner escribiendo
//   $( "#chatcomen" ).keypress(function( event ) {
//       $.get("/nombre",function(data){

//         nombre=data.usuario;         
//         socket.emit('escribiendo', nombre);
//       });
// });
// });

});


