var express = require('express');
var holidayModeRouter = express.Router();

var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");


// GET HOLIDAY MODE
holidayModeRouter.get('/holidayMode', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        ejsObject = ejsObjectFactory(
            {
                title: 'Holiday Mode',
                heading: 'Holiday Mode',
                navMenu: nav,
                isLoggedIn: true,
                username: req.session.username
            }
        );

        res.render('holidayMode.ejs', ejsObject);

    }

});





module.exports = holidayModeRouter;