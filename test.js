var http = require('http');
var querystring = require('querystring');
var util = require('util');
var form = require('fs').readFileSync('signup.html');
var maxData = 12 * 1024 * 1024;

http.createServer(function (request, response){
	if (request.method === 'POST') {
		var postData = '';
		request.on('data', function (chunk) {
			postData += chunk;
			if (postData.length > maxData) {
				postData = '';
				this.pause();
				response.writeHead(413);
				response.end('Demasiado larga');
			}
		}).on('end', function() {
			if (!postData) { response.end(); return; }
			var postDataObject = querystring.parse(postData);
			console.log('El usuario ha escroto:\n', postData);
			response.end('Has escrito:\n' + util.inspect(postDataObject));
		});
		return;
	}
	if (request.method === 'GET') {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(form);
	}
}).listen(8080);

console.log('Servidor escuchando en el puerto 8080');