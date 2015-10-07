var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');


var express = require('express');
var gardenRouter = express.Router();


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



// GET GARDEN
gardenRouter.get('/garden', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        ejsObject = generateEjsVariables(
            "Garden",                       // Title of the page
            "This is Garden page",          // Heading of the page
            defaults.msg,                   // msg status update
            defaults.userMsg(req),                        // after login Welcome user name
            defaults.error,                 // error status
            nav,                            // nav menu data
            true,                           // isLoggedIn
            defaults.userStatusData,        // all users status whether logged in or not
            defaults.userEditData,          // modify users info
            defaults.lightsData,            // lights data
            ''                              // gardens data
        );

        res.render('garden.ejs', ejsObject);

        printDebug(req, "GARDEN");

    }

});



// POST -->  GARDEN
gardenRouter.post('/garden', function(req, res, next) {

    var formName = req.body.formName;
    var sqlRequest;
    var gardensData = '';
    var navMenu;

    if (formName === 'showGardenTimes') {

        sqlRequest = "SELECT * FROM 'PREFERENCE'";

        if (req.session.isAdmin === 0) {

            navMenu = nav.standard;

        } else {

            navMenu = nav.full;

        }

        var ejsObject;
        gardensData = [];


        db.serialize(function() {

            db.each(sqlRequest, function(err, row) {

                if (row.pref_name.startsWith('garden')) {

                    gardensData.push({
                        gardenName: row.pref_name,
                        startTime: row.pref_startTime,
                        stopTime: row.pref_stopTime,
                        isActive: row.pref_isActive
                    });

                }

            }, function (){


                ejsObject = generateEjsVariables(
                    "Garden",                        // Title of the page
                    "This is Garden page",           // Heading of the page
                    defaults.msg,                    // msg status update
                    defaults.userMsg(req),                         // after login Welcome user name
                    defaults.error,                  // error status
                    navMenu,                         // nav menu data
                    true,                            // isLoggedIn
                    defaults.userStatusData,         // all users status whether logged in or not
                    defaults.userEditData,           // modify users info
                    defaults.lightsData,             // lights data
                    gardensData                      // gardens data
                );


                console.log(gardensData);

                res.render('garden.ejs', ejsObject);

            })

        });

    }


    if (req.body.submitBttn === 'Set Garden Times') {

        sqlRequest = "UPDATE PREFERENCE " +
            "SET pref_startTime = (case when pref_name = 'garden_sprinkler1' then '"+req.body.garden_sprinkler1On+"' "+
            "when pref_name = 'garden_sprinkler2' then '"+req.body.garden_sprinkler2On+"' "+
            "end)," +

            "pref_stopTime = (case when pref_name = 'garden_sprinkler1' then '"+req.body.garden_sprinkler1Off+"' "+                                                          "when pref_name = 'light_livingRoom' then '"+req.body.light_livingRoomOff+"' "+
            "when pref_name = 'garden_sprinkler2' then '"+req.body.garden_sprinkler2Off+"' "+
            "end) WHERE pref_name LIKE 'garden_%';";

        db.run(sqlRequest, function (err) {

            if (err !== null) next(err);
            else {
                var navMenu = nav.full;
                var gardensData = '';

                ejsObject = generateEjsVariables(
                    "Garden",                                   // Title of the page
                    "This is Garden page",                      // Heading of the page
                    "Garden on/off time updated successfully",  // msg status update
                    defaults.userMsg(req),                                    // after login Welcome user name
                    defaults.error,                             // error status
                    navMenu,                                    // nav menu data
                    true,                                       // isLoggedIn
                    defaults.userStatusData,                    // all users status whether logged in or not
                    defaults.userEditData,                      // modify users info
                    defaults.lightsData,                        // lights data
                    gardensData                                 // gardens data
                );

                res.render("garden.ejs", ejsObject);

            }
        });
    }

});




module.exports = gardenRouter;