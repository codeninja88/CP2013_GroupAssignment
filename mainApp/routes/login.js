var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');


var express = require('express');
var loginRouter = express.Router();


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



// POST -->  LOGIN
loginRouter.post('/',

    function(req, res, next) {

        db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', req.body.username, req.body.password,

            function(err, row) {

                var ejsObject;

                // query returns undefined if username entered does not exist in db
                if (row === undefined || !row.user_username) {

                    userCheck(req);

                    ejsObject = generateEjsVariables(
                        "Home",                        // Title of the page
                        "This is Home page",           // Heading of the page
                        defaults.msg,                             // msg status update
                        defaults.userMsg,               // after login Welcome user name
                        "ERROR:\t Invalid username and/or password.",                           // error status
                        nav.simple,                        // nav menu data
                        false,                            // isLoggedIn
                        defaults.userStatusData,         // all users status whether logged in or not
                        defaults.userEditData,           // modify users info
                        defaults.lightsData,             // lights data
                        defaults.gardensData             // gardens data
                    );

                    res.render('index.ejs', ejsObject);


                } else if (row.user_password === req.body.password && row.user_isAdmin === 0) { //different menu shown due to access level

                    navMenu = nav.standard;
                    // Changing login status in database to user is logged in / true
                    db.run("UPDATE 'USER' SET user_isLoggedIn = ? WHERE user_username = ?", 1, req.body.username, function (err) {

                        if (err !== null) next(err);

                    });


                    req.session.username = req.body.username;
                    req.session.isAdmin = row.user_isAdmin;



                    if ((row.user_startTime != null || row.user_startTime != undefined) &&
                        (row.user_endTime != null || row.user_endTime != undefined)) {

                        req.session.startTime = row.user_startTime;
                        req.session.endTime = row.user_endTime;


                        console.log(req.session.startTime);
                        console.log(req.session.endTime);

                    }



                    res.redirect("/");

                    console.log("Logged in successfully.");
                    printDebug(req, "INDEX");

                } else if (row.user_password === req.body.password && row.user_isAdmin === 1) {
                    navMenu = nav.full;
                    // Changing login status in database to user is logged in / true
                    db.run("UPDATE 'USER' SET user_isLoggedIn = ? WHERE user_username = ?", 1, req.body.username, function (err) {

                        if (err !== null) next(err);

                    });

                    req.session.username = req.body.username;
                    req.session.isAdmin = row.user_isAdmin;


                    res.redirect("/");

                    console.log("Logged in successfully.");
                    printDebug(req, "INDEX");

                } else {

                    console.log("If you got here that means we have bug in code.");

                }

            }
        );
    }
);






module.exports = loginRouter;