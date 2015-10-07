var express = require('express');
var holidayModeRouter = express.Router();

var nav = require("../modules/nav.js");
var generateEjsVariables = require("../modules/generateEjsVariables.js");
var defaults = require("../modules/defaults.js");


var userMsg = "";

function userCheck(req) {

    if (req.session.username) {

        userMsg = 'Welcome ' + req.session.username.toUpperCase();

    } else {

        userMsg = "";

    }

}


// PRINT HELPFUL DEBUG INFORMATION TO CONSOLE
function printDebug(req, pageName) {

    //console.log(req.session);

    console.log("\nPAGE: " + pageName);

    if (req.session.username !== undefined) {

        console.log("---> user: \t" + req.session.username);
        console.log("---> isAdmin: \t" + req.session.isAdmin);

    }


}



// GET HOLIDAY MODE
holidayModeRouter.get('/holidayMode', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Holiday Mode",                        // Title of the page
            "This is Holiday Mode page",           // Heading of the page
            defaults.msg,                             // msg status update
            userMsg,               // after login Welcome user name
            defaults.error,                           // error status
            nav,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );

        res.render('holidayMode.ejs', ejsObject);

        printDebug(req, "HOLIDAY MODE");

    }

});





module.exports = holidayModeRouter;