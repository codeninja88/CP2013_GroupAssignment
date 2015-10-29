var express = require('express');
var indexRoute = express.Router();

var nav = require('../modules/nav.js');
var ejsObjectFactory = require('../modules/ejsObjectFactory.js');
var generateUserMsg = require('../modules/generateUserMsg.js');


indexRoute.get('/', function(req, res) {

    //helper function to generate ejsObject
    function generateEjsObject (nav, isLoggedIn){

        return ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav,
                isLoggedIn: isLoggedIn,
                username: generateUserMsg(req.session.username)
            }
        );

    }

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        res.render('index.ejs', generateEjsObject(nav.full, true));


    } else if (req.session.username && req.session.isAdmin === 0){

        res.render('index.ejs', generateEjsObject(nav.standard, true));


    } else {

        res.render('index.ejs', generateEjsObject(nav.simple, false));

    }

});


module.exports = indexRoute;