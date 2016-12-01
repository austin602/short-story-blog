var express = require ('express');


var router = express.Router ();


router.get ('/login', function (request, response) {
    // response.send ('You are now on the login page.');

    // Check to see if the user session exists and
    // the user is defined.
    if (request.session.user) {
        // Redirect user to the dashboard.
        response.redirect ('/user/dashboard');
    }
    else {
        // Show the login template page.
        response.render ('login');
    }
});

router.post ('/login', function (request, response) {
    User.findOne(
        request.body,
        function (error, result) {
            if (error) {
                var errorMessage = 'Unable to .';
                console.error ('***ERROR: ' + errorMessage);
                response.send (errorMessage);
            }
            else if (!result) {

                request.flash ('error', 'Your username or password is not correct');

                response.redirect ('/user/login');

            }
            else {
                console.log('This is the found user: ', result);

                request.session.user = result;

                console.log('This is the session data: ', request.session);

                response.redirect ('/user/dashboard');
            }
        }
    )
});

router.get ('/register', function (request, response) {
    response.render ('register');
});

router.post ('/register', function (request, response) {
    var newUser = User ({
        username: request.body.username,
        password: request.body.password,
        email: request.body.email
    });
    newUser.save(function (error) {
        if (error) {
            console.error('**** not able to save user');
            console.error(error);
        }
        else {
            console.log('user saved', request.body.username);
            response.redirect('/login')
        }
    });
});

router.get ('/reset', function (request, response) {
    response.send ('Your are on the reset page.');
});


router.get ('/dashboard', function (request, response) {
    // response.send ('You are now on the dashboard page.');

    console.log ('session: ', request.session);

    response.render ('dashboard', {
        data: {
            // Pass the session user to the template for
            // rendering the user information.
            user: request.session.user
        }
    });
});

router.get ('/logout', function (request, response) {
    request.session.destroy ();
    response.redirect ('/user/login');
});

// Exporting the router from this module.
module.exports = router;
