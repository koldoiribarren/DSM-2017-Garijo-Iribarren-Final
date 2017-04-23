// Establish the connection with the socket
var socket = io.connect('http://localhost:8080');

// We assign a new 'on' event to the socket using the name of the new communication, 
// and define the callback function that acts when the information arrives.
socket.on('login', function(data){

});


$(document).ready(function() {

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
		alert(formData);
		$.ajax({type: 'POST', url: '/login', data: formData}).done(function(data){
			console.log(data);
			form.trigger('reset');


			 if (datos[0] == true || datos[1] == false){

			 } else if(datos[0] == false || datos[1] == true){

			 };

		});
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


