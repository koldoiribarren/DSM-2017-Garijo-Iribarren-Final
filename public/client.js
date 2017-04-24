$(window).on("load", function() {


// Establish the connection with the socket
var socket = io.connect('http://localhost:8050');

// We assign a new 'on' event to the socket using the name of the new communication, 
// and define the callback function that acts when the information arrives.
socket.on('connect', function(data){

	 socket.emit('unir', nickname);
	// $.get("/nombre",function(data){
 //    nickname=data.usuario;
 //    //∫alert(nickname);
 //    socket.emit('unir', nickname);
 //    //socket.emit('añadiruser', nickname);
 //    socket.nickname = nickname;
 //  });

});


socket.on('unir',function(datos){
	console.log("Nombre: " + datos.info);
	  $('#user_list').append('<p class="user">'+datos.info+'</p>');

	  // var $content = $('.ventana');
	  // $content.scrollTop(10000000);
});

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




