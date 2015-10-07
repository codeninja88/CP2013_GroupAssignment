var express = require('express');
var homeRouter = express.Router();

var nav = require("../modules/nav.js");
var generateEjsVariables = require("../modules/generateEjsVariables.js");
var defaults = require("../modules/defaults.js");


// PRINT HELPFUL DEBUG INFORMATION TO CONSOLE
function printDebug(req, pageName) {

    //console.log(req.session);

    console.log("\nPAGE: " + pageName);

    if (req.session.username !== undefined) {

        console.log("---> user: \t" + req.session.username);
        console.log("---> isAdmin: \t" + req.session.isAdmin);

    }

}


// GET HOME
homeRouter.get('/', function(req, res) {

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        ejsObject = generateEjsVariables(
            "Home",                        // Title of the page
            "This is Home page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg(req),               // after login Welcome user name
            defaults.error,                           // error status
            nav.full,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );


        res.render('index.ejs', ejsObject);

        printDebug(req, "HOME / INDEX");


    } else if (req.session.username && req.session.isAdmin === 0){


        ejsObject = generateEjsVariables(
            "Home",                        // Title of the page
            "This is Home page",           // Heading of the page
            defaults.userMsg(req),                             // msg status update
            defaults.userMsg(req),               // after login Welcome user name
            defaults.error,                           // error status
            nav.standard,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );



        res.render('index.ejs', ejsObject);

        printDebug(req, "HOME / INDEX");

    } else {

        ejsObject = generateEjsVariables(
            "Home",                          // Title of the page
            "This is Home page",             // Heading of the page
            defaults.msg,                    // msg status update
            defaults.userMsg(req),                // after login Welcome user name
            defaults.error,                  // error status
            nav.simple,                      // nav menu data
            false,                           // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );


        res.render('index.ejs', ejsObject);


        printDebug(req, "HOME / INDEX");
    }

});


module.exports = homeRouter;