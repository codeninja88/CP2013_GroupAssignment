var express = require('express');
var router = express.Router();

var nav = require("../modules/nav.js");

var generateEjsVariables = require("../modules/generateEjsVariables.js");

var defaults = require("../modules/defaults.js");



function userCheck(req) {

    var userMsg = "";

    if (req.session.username) {

        userMsg = 'Welcome ' + req.session.username.toUpperCase();

    } else {

        userMsg = "";

    }

}


// GET HOME
router.get('/', function(req, res) {

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Home",                        // Title of the page
            "This is Home page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg,               // after login Welcome user name
            defaults.error,                           // error status
            nav.full,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );


        res.render('index.ejs', ejsObject);

        //printDebug(req, "HOME / INDEX");


    } else if (req.session.username && req.session.isAdmin === 0){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Home",                        // Title of the page
            "This is Home page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg,               // after login Welcome user name
            defaults.error,                           // error status
            nav.standard,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );



        res.render('index.ejs', ejsObject);

        //printDebug(req, "HOME / INDEX");

    } else {

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Home",                          // Title of the page
            "This is Home page",             // Heading of the page
            defaults.msg,                    // msg status update
            defaults.userMsg,                // after login Welcome user name
            defaults.error,                  // error status
            nav.simple,                      // nav menu data
            false,                           // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );


        res.render('index.ejs', ejsObject);


        //printDebug(req, "HOME / INDEX");
    }

});


module.exports = router;