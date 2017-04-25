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

		// $.ajax({type: 'POST', url: '/comprobar', data: datosformu}).done(function(datos){
		    
		//     if(datos=="YaHay10"){
		//     	document.getElementById("comemal").style.visibility="visible";
		//     	document.getElementById("comemal").innerHTML = "Lo sentimos ya hay 10 usuarios, espere a que alguien se desconecte";
		//     }else if (datos=="YaExiste") {
		//     	document.getElementById("comemal").style.visibility="visible";
		//     	document.getElementById("comemal").innerHTML = "Ese nombre ya existe por favor cambielo";
		//     }else if (datos=="Largo") {
		//     	//alert("largoooo");
		//     	document.getElementById("comemal").style.visibility="visible";
		//     	document.getElementById("comemal").innerHTML = "El nombre debe tener al menos 5 caracteres";
		//     }else{
		//     	//window.location='/chat?nombre=';
		//     	window.location='/chat';
		//     }

		//     formu.trigger('reset');
		// });

	});
});