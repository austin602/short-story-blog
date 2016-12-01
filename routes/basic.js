var express = require ('express');

var router = express.Router ();

router.get ('/', function (request, response) {
    response.render ('home');
});

router.get ('/mystery', function (request, response) {
    response.render ('mystery');
});

router.get ('/true-stories', function (request, response) {
    response.render ('true-stories');
});

router.get ('/folk-legend', function (request, response) {
    response.render ('folk-legend');
});

router.get ('/lets-not-meet', function (request, response) {
    response.render ('lets-not-meet');
});

//export the router from this file that is seen
//by nodeJs as its own module.
module.exports = router;
