var express = require('express');
var doorGatesRouter = express.Router();

var nav = require("../modules/nav.js");
var EjsObjectFactory = require("../modules/EjsObjectFactory.js");





// GET DOORS/GATES
doorGatesRouter.get('/doorGates', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        ejsObject = EjsObjectFactory(
            {
                title: 'Doors and Gates',
                heading: 'Doors and Gates',
                navMenu: nav,
                isLoggedIn: true,
                username: req.session.username
            }
        );

        res.render('doorGates.ejs', ejsObject);

    }

});


module.exports = doorGatesRouter;