var express = require('express');
var doorGatesRoute = express.Router();

var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");
var generateUserMsg = require('../modules/generateUserMsg.js');



// GET DOORS/GATES
doorGatesRoute.get('/', function(req, res) {

    // helper function
    function generateEjsObject (nav){

        return ejsObjectFactory(
            {
                title: 'Doors and Gates',
                heading: 'Doors and Gates',
                navMenu: nav,
                isLoggedIn: true,
                username: generateUserMsg(req.session.username)
            }
        );

    }

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) {

        res.render('doorGates.ejs', generateEjsObject(nav.standard));


    } else if (req.session.username && req.session.isAdmin === 1) {

        res.render('doorGates.ejs', generateEjsObject(nav.full));


    } else res.redirect('/');


});


module.exports = doorGatesRoute;