//load in the mongoose nodejs package.
var mongoose = require ('mongoose');

//grab the schema object from mongoose.
var Schema = mongoose.Schema;

//create the model schema.
var commentSchema = new Schema ({
    content: String,

    author: { type:Schema.Types.ObjectId, ref:'User' },
});

//create the model object.
var Comment = mongoose.model ('Comment' , commentSchema);

//make the model object available to
//other NodeJs modules.
module.exports = Comment;
