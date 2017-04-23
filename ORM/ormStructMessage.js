var mongoose = require('mongoose');
var Schema = mongoose.Schema;  // modelo no relacional de lo que vamos a almacenar en la base de datos 
var ObjectId = Schema.ObjectId;
// STRUCTURE FOR DIFFERENT ORM(OBJECT RELATIONAL MAPPING)

// FOR MESSAGES
var NewMessageChat = new Schema(
	{
		nickname: String,
 		message: String,
  		fecha: Date
	}
);
//EXPORT THE NewMessageChat MODEL
module.exports= mongoose.model('NewMessageChat', NewMessageChat);
