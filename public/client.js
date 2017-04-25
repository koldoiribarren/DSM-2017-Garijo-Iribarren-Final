$(window).on("load", function() {


// Establish the connection with the socket
var socket = io.connect('http://localhost:8050');

// We assign a new 'on' event to the socket using the name of the new communication, 
// and define the callback function that acts when the information arrives.
socket.on('connect', function(data){

	 socket.emit('unir', nickname);

	 $.get("/nombre",function(data){
	    nickname=data.usuario;
	    //∫alert(nickname);
	    socket.emit('unir', nickname);
	    socket.emit('añadiruser', nickname);
	    socket.nickname = nickname;
	  });

	  $.get("/usuarios",function(dato){
	    //$(".listausuariosx").remove();
	    for (var i = 0; i < dato.info.length; i++) {
	      //socket.emit('añadiruser', dato.info[i]);
	      $('#listausuarios').append('<li class="listausuariosx" id="'+dato.info[i]+'">'+dato.info[i]+'</li>');
	    };
	  });

	  $.get("/mensajes",function(dat){
	    if(dat.nombr.length>10){
	      for (var i = dat.nombr.length-10; i < dat.nombr.length; i++) {
	        $('.parra').append('<p class="partex2">'+dat.nombr[i]+": "+dat.mens[i]+'</p>');
	      };
	    }else{
	      for (var j = 0; j < dat.nombr.length; j++) {
	        $('.parra').append('<p class="partex2">'+dat.nombr[j]+": "+dat.mens[j]+'</p>');
	      };
	    }
	   }); 

});


socket.on('unir',function(datos){
	console.log("Nombre: " + datos.info);
	  $('#user_list').append('<p class="user">'+datos.info+'</p>');

	  // var $content = $('.ventana');
	  // $content.scrollTop(10000000);
});


socket.on('mensajeschat', function(datos) {
  //alert('Hay que meter esta info en el chat: ' + datos.info);
  if(socket.nickname==datos.usuario){
    $('.parra').append('<p class="partex">'+datos.usuario+": "+datos.info+'</p>');
  }else{
    $('.parra').append('<p class="partex2">'+datos.usuario+": "+datos.info+'</p>');
  }
  var $content = $('.ventana');
	$content.scrollTop(10000000);
});

socket.on('unir',function(datos){
  $('.parra').append('<p class="user">'+datos.info+'</p>');

  var $content = $('.ventana');
  $content.scrollTop(10000000);
});

socket.on('añadiruser',function(datos){
  //añadir los usuarios a la lista
  $('#listausuarios').append('<li class="listausuariosx" id="'+datos.usuario+'">'+datos.usuario+'</li>');

});

socket.on('escribiendo',function(datos){
  document.getElementById(datos.usuario).innerHTML=datos.usuario+' escribiendo...';
});

socket.on('noescribiendo',function(datos){
 document.getElementById(datos.usuario).innerHTML=datos.usuario;
});

socket.on('desconectar',function(datos){
  $('.parra').append('<p class="user">'+datos.info+'</p>');
  //borrar el <p> de la lista de contactos
  
  var $content = $('.ventana');
  $content.scrollTop(10000000);
});

socket.on('quitarlista',function(datos){
  document.getElementById(datos.info).remove();
});

//--------END SOCKET----------------------------------------//




	$('#pass_bool').on('change', function(){
		if ($('#pass_bool').is(':checked')){
			alert('on');
		} else if (!$('#pass_bool').is(':checked')){
			alert('off');
		}
	});

	$('#login_form').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var formData = form.serialize();
		console.log(formData);

		//COMPROBAMOS QUE EL CAMPO NO ESTÉ VACÍO 
		if(document.getElementById("inputUser").value == ""){

			confirm("Debe introducir un nombre de usuario");

		}else{

			$.ajax({type: 'POST', url: '/login', data: formData}).done(function(data){
				// console.log(formData);
				// console.log(data);
				form.trigger('reset');
				
				// STORED USER 
				 if (data[0] == true || data[1] == false){
				 	
	                alert("Has elegido "+ data[2] + " como nombre de usuario.");

	                window.location.replace("http://localhost:8050/boards.html"); 

	            	// $.ajax({type: 'POST', url: '/goToChat'}).done(function(data){
	            	// 	console.log("Redireccionando al chat");
	            	// });
				 	

				 // BUSY NICKNAME
				 } else if(data[0] == false || data[1] == true){
				 	
				 	 alert("El nombre de usuario que tratas de usar: "+ data[2] + ", está ocupado, utiliza otro.");			

				 }else{

	                alert("Estamos teniendo problemas con la base de datos, intentelo de nuevo más tarde.");
	               	               
				 }

			});
		}
	});

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

//   //$('#chatformu').submit(function(e){
//   $('#botonenviar').on('click',function(e){
//     	e.preventDefault();
//       var mensaje = $('#chatcomen').val();
      
//      // reestablecer el valor a cero
//       $('#chatcomen').val('');
      
//       if(mensaje!=""){
//         $.get("/nombre",function(data){
//         nickname=data.usuario;
//         socket.emit('mensajeschat', {info: mensaje, usuario: nickname});//usuario:
//       });
//       }
      
//   });
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




