var express = require('express');
var homeRouter = express.Router();

var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");



// GET HOME
homeRouter.get('/', function(req, res) {
    var ejsObject;


    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        ejsObject = ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav.full,
                isLoggedIn: true,
                username: req.session.username
            }
        );

        res.render('index.ejs', ejsObject);



    } else if (req.session.username && req.session.isAdmin === 0){

        ejsObject = ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav.standard,
                isLoggedIn: true,
                username: req.session.username

            }
        );



        res.render('index.ejs', ejsObject);


    } else {

        ejsObject = ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav.simple,
                isLoggedIn: false,
                username: req.session.username

            }
        );

        res.render('index.ejs', ejsObject);


    }

});


module.exports = homeRouter;