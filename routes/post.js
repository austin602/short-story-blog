// Bring in express.
var express = require ('express');

// Create an express router.
var router = express.Router ();

// Load the Post and Comment schema object.
var Post = require ('../model/post.js');
var Comment = require ('../model/comment.js');

router.get ('/create', function (request, response) {
    // response.send ('This is the post creation page.');
    response.render ('post/edit', {
        data: {
            title: 'Create Post',
            method: 'POST'
        }
    });
});


router.post ('/', function (request, response) {

    var newPost = Post (request.body);

    newPost.save (function (error) {
        if (error) {
            var errorMessage = 'Unable to save the user to the page.';
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            if (request.sendJson) {
                response.json ({
                    message: 'New post was saved.'
                });
            }
            else {
                // Add a flash message of our success.
                request.flash ('success', 'post was created.');

                // Redirect back to the post create page.
                response.redirect ('/post');
            }
        }
    // response.send ('This is where posts are saved.');
});
    // response.send ('This is where posts are saved.');
});

// Route to view my posts.
router.get ('/', function (request, response) {

    Post.find ({}, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to load posts.';
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {

            // Check to see if we need to reply with a JSON object.
            if (request.sendJson) {
                // Respond with a JSON object of
                // the result from the database query.
                response.json (result);
            }
            else {
                // Respond with HTML markup.
                // console.log ('**** RESULT: ', result);
                response.render ('post/list', {
                    data: {
                        postList: result
                    }
                });
            }
        }
    });

    // response.render ('post/view');
    // response.send ('This is where we view posts.');
});


// Route to grab a specific item by it's id.
router.get ('/:id', function (request, response) {
    // Grab the post id by the ':id' value in the url path.
    var postId = request.params.id;

    // Use the mongoose query builder to grab the post and it's
    // related comments.
    console.log ('***** here');
    Post
        .findById (postId)
        .populate ({
        path: 'comments',

        populate: {
            path: 'author'
        }
    })
    .exec (function (error, result) {
        response.render ('post/view', {
            data: {
                post: result
            }
        });

        console.log ('This is the result: ', result);
    });

});



router.get ('/:id/edit', function (request, response) {
    // Grab the post id by the ':id' value in the url path.
    var postId = request.params.id;

    // Run a query for our post by an id.
    Post.findById (postId, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to find prot by id: ' + postId;
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            response.render ('post/edit', {
                data: {
                    title: 'Edit post',
                    method: 'PUT',
                    post: result
                }
            });
        }
    });
})

// Create a route to handle updating an existing post.
router.put ('/:id', function (request, response) {
    var postId = request.params.id;

    post.findByIdAndUpdate (
        // id to search by
        postId,

        // What needs to be udpdated.
        request.body,

        // Callback function.
        function (error, result) {
            if (error) {
                // ... Error goes here...
            }
            else {
                if (request.sendJson) {
                    response.json ({
                        message: 'post was updated.'
                    });
                }
                else {
                    // response.send ('The post has been updated: ' + postId);

                    // Redirect back to the specific post so we
                    // can confirm the changes to the post.
                    response.redirect ('/post/' + postId);
                }
            }
        }
    );
});

// Create a route to delete a post by id.
router.get ('/:id/delete', function (request, response) {
    // response.send ('The post was deleted.');
    var postId = request.params.id;

    post.findByIdAndRemove (postId, function (error, result) {
        if (error) {
            // ...
        }
        else {
            if (request.sendJson) {
                response.json ({
                    message: 'post was deleted.'
                })
            }
            else {
                response.redirect ('/post');
            }
        }
    })
});

// Create a route to delete a post by id.
router.delete ('/:id', function (request, response) {
    // response.send ('The post was deleted.');
    var postId = request.params.id;

    post.findByIdAndRemove (postId, function (error, result) {
        if (error) {
            // ...
        }
        else {
            if (request.sendJson) {
                response.json ({
                    message: 'post was deleted.'
                })
            }
            else {
                response.redirect ('/post');
            }
        }
    })
});

// Create a route to save comments.
router.post ('/:id/comment', function (request, response) {
    // Grab the id from the url path.
    var postId = request.params.id;

    // Find a specific post by id.
    post.findById (postId, function (error, post) {
        // Check for errors.
        if (error) {
            var errorMessage = 'Unable to create comment for post by id: ' + postId;
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            // Create our comment model object.
            var comment = Comment (request.body);

            // Link the comment to user that is currently logged in.
            var user = request.session.user;
            comment.author = user;

            // Save the comment to the database.
            comment.save (function (error, result) {
                // Check for errors.
                if (error) {
                    var errorMessage = 'Unable to save the comment after finding post.';
                    console.error ('*** ERROR: ' + errorMessage);
                    response.send (errorMessage);
                }
                else {

                    // Link the comments object to the found
                    // post object.
                    post.comments.push (comment);

                    // Save the changes to the post.
                    post.save (function (error, prodResult) {
                        // response.send ('Saving the comment...');
                        response.redirect ('/post/' + postId);
                    });
                }
            });
        }
    });
});


// Export the router for use outside of module.
module.exports = router;
