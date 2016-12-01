// NOTE: Step 1 - Load express and create the server.
// Load in the express nodejs module.
var express = require ('express');

// Create the express server app.
var server = express ();

server.use (express.static ('public'));
//NOTE:step 6 add bodyParser
var bodyParser = require ('body-parser');

server.use (bodyParser.urlencoded ({ extended: true }));

server.use (bodyParser.json());

var methodOverride = require('method-override');

server.use (methodOverride (function (request, response) {
    //Grab the request information and check to see
    //if the http method was sent down as an _method value.

    //check if the request has body content.
    if (request.body) {

        //check if the request body is a javascript literal object.
        if (typeof request.body === 'object') {

            //check if the body has an '_method' property on it.
            if (request.body._method) {

                //grab the http method from the body.
                var method = request.body._method;

                //remove the _method property from the body.
                delete request.body._method;

                //return the actual http method.
                return method;
            }
        }
    }
}));
var session = require ('express-session');

server.use (session ({
    secret:'This is my secret phrase',
    resave: false,
    saveUninitialized: true
}));

var flash = require ('connect-flash');

server.use (flash());

server.use (function (request, response, next) {
    response.locals.user = request.session.user;

    //set flash object to be set and used before running any other routes or functions.
    response.locals.message = request.flash ();

    //Grab the content-type from the request.
    var contentType = request.headers ['content-type'];
    request.contentType = contentType;
//set our object to use JSON if
//we detect a request for 'application/json'.
    if (contentType == 'application/json') {
        request.sendJson = true;
    }

//move to the next route.
    next ();

});
// NOTE: Step 2 - Run the server.
var port = 3000;



//NOTE: Step 4 - Set up handlebars.
var handlebars = require ('express-handlebars');
server.engine ('.hbs', handlebars ({
    layoutsDir:'templates',
    defaultLayout: 'index',
    extname:'.hbs'

}));

server.set ('views', __dirname + '\\templates\\partials');

server.set ('view engine', '.hbs');

// Launch the server app.
server.listen (port, function (error) {
    // Check to see if the server was unable to start up.
    if (error !== undefined) {
        console.error ('*** ERROR: Unable to start the server.');
        console.error (error);
    }
    else {
        // No errors found the server is good to go.
        console.log ('- The server has successfully started on port: ' + port);
    }
});

var mongoose = require ('mongoose');

mongoose.connect ('mongodb://localhost:27017/sample_database')

// //NOTE: Step 5 - set up url routes
//
var basicRoutes = require ('./routes/basic.js');

server.use ('/', basicRoutes);

var postRoutes = require ('./routes/post.js');

server.use ('/post', postRoutes);

var userRoutes = require ('./routes/user.js');

server.use ('/user', userRoutes);
