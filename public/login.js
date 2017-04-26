$(document).ready(function() {
	
	$('#login_form').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var formData = form.serialize();
		console.log(formData);

		if(document.getElementById("inputUser").value == ""){

			confirm("Debe introducir un nombre de usuario");

		}else{

			$.ajax({type: 'POST', url: '/login', data: formData}).done(function(data){

				form.trigger('reset');
				
				// STORED USER 
				if (data[0] == 4){
				
					alert("Has elegido "+ data[1] + " como nombre de usuario.");

					window.location.replace("http://localhost:8050/boards.html"); 

	
				// BUSY NICKNAME
				} else if(data[0] == 2){

					alert("El nombre de usuario que tratas de usar: "+ data[1] + ", está ocupado, utiliza otro.");			

				}else if(data[0] == 1){

					alert("Estamos teniendo problemas con la base de datos, intentelo de nuevo más tarde.");

				}else if(data[0] == 3){

					alert("Más de 10 usuarios conectados, intentelo de nuevo más tarde");
				}

			});
		}	
	});
});