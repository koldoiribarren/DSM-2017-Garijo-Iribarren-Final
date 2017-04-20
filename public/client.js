$(document).ready(function() {
	$('#loginForm').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var formData = form.serialize();
		alert(formData);
		$.ajax({type: 'POST', url: '/middle1', data: formData}).done(function(data){
			console.log(data);
			form.trigger('reset');
		});
	});
	$('#signupForm').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var formData = form.serialize();
		alert(formData);
		$.ajax({type: 'POST', url: '/middle2', data: formData}).done(function(data){
			console.log(data);
			form.trigger('reset');
		});
	});

});