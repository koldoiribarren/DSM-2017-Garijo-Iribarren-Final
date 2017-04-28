$(document).ready(function() {
	
	$('#login_form').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var formData = form.serialize();

		if(document.getElementById('inputUser').value == ''){

			confirm('Debe introducir un nombre de usuario');

		}else{

			$.ajax({type: 'POST', url: '/login', data: formData}).done(function(data){

				form.trigger('reset');
				
				// STORED USER 
				if (data[0] == 4){
				
					alert('Has elegido '+ data[1] + ' como nombre de usuario.');
					window.location.replace('./boards.html'); 
	
				// BUSY NICKNAME
				} else if(data[0] == 2){
					$('#inputP').append('<p id="alert_text"> El nombre de usuario que tratas de usar está ocupado, utiliza otro</p>');
				
				} else if(data[0] == 1){
					$('#inputP').append('<p id="alert_text"> Estamos teniendo problemas con la base de datos, inténtelo de nuevo más tarde</p>');
				
				} else if(data[0] == 3){
					$('#inputP').append('<p id="alert_text"> Más de 10 usuarios conectados, inténtelo de nuevo más tarde</p>');
				}

			});
		}	
	});

	$('#inputUser').on('click', function(event){
		$('#alert_text').remove();
	})
});