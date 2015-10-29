var express = require('express');
var homeRouter = express.Router();

var nav = require('../modules/nav.js');
var ejsObjectFactory = require('../modules/ejsObjectFactory.js');
var generateUserMsg = require('../modules/generateUserMsg.js');


// GET HOME
homeRouter.get('/', function(req, res) {

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        var ejsObject = ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav.full,
                isLoggedIn: true,
                username: generateUserMsg(req.session.username)
            }
        );

        res.render('index.ejs', ejsObject);



    } else if (req.session.username && req.session.isAdmin === 0){

        var ejsObject = ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav.standard,
                isLoggedIn: true,
                username: generateUserMsg(req.session.username)

            }
        );



        res.render('index.ejs', ejsObject);


    } else {

        var ejsObject = ejsObjectFactory(
            {
                title: 'Home',
                navMenu: nav.simple,
                isLoggedIn: false,
                username: generateUserMsg(req.session.username)

            }
        );

        res.render('index.ejs', ejsObject);


    }

});


module.exports = homeRouter;