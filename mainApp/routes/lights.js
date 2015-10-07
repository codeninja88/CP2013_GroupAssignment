var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');


var express = require('express');
var lightsRouter = express.Router();


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



// GET LIGHTS
lightsRouter.get('/light', function(req, res) {

    var ejsObject;
    lightsData = '';

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard, lightsData);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full, lightsData);

    else res.redirect('/');


    function setInfo (nav, lightsData){

        ejsObject = generateEjsVariables(
            "Lights",                        // Title of the page
            "This is Light page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg(req),                    // after login Welcome user name
            defaults.error,                           // error status
            nav,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            lightsData,             // lights data
            defaults.gardensData             // gardens data
        );

        res.render('light.ejs', ejsObject);

        printDebug(req, "LIGHT");

    }


});



// POST -->  LIGHTS
lightsRouter.post('/light', function(req, res, next) {

    var formName = req.body.formName;
    var sqlRequest;
    var lightsData = '';
    var navMenu;
    var ejsObject;

    if (formName === 'showLightTimes') {

        if (req.session.isAdmin === 0) navMenu = nav.standard;

        else navMenu = nav.full;

        lightsData = [];


        sqlRequest = "SELECT * FROM 'PREFERENCE'";

        db.serialize(function() {

            db.each(sqlRequest, function(err, row) {

                if (row.pref_name.startsWith('light')) {

                    lightsData.push({
                        lightName: row.pref_name,
                        startTime: row.pref_startTime,
                        stopTime: row.pref_stopTime,
                        isActive: row.pref_isActive
                    });

                }

            }, function (){


                ejsObject = generateEjsVariables(
                    "Lights",                        // Title of the page
                    "This is Light page",           // Heading of the page
                    defaults.msg,                             // msg status update
                    defaults.userMsg(req),               // after login Welcome user name
                    defaults.error,                           // error status
                    navMenu,                        // nav menu data
                    true,                            // isLoggedIn
                    defaults.userStatusData,         // all users status whether logged in or not
                    defaults.userEditData,           // modify users info
                    lightsData,             // lights data
                    defaults.gardensData             // gardens data
                );

                console.log(lightsData);

                res.render('light.ejs', ejsObject);

            })

        });

    }


    if (req.body.submitBttn === 'Set Times') {

        sqlRequest = "UPDATE PREFERENCE " +
            "SET pref_startTime = (case when pref_name = 'light_balcony' then '"+req.body.light_balconyOn+"' "+
            "when pref_name = 'light_livingRoom' then '"+req.body.light_livingRoomOn+"' "+
            "when pref_name = 'light_bedroom1' then '"+req.body.light_bedroom1On+"' "+
            "when pref_name = 'light_bedroom2' then '"+req.body.light_bedroom2On+"' "+
            "when pref_name = 'light_kitchen' then '"+req.body.light_kitchenOn+"' "+
            "when pref_name = 'light_hallway' then '"+req.body.light_hallwayOn+"' "+
            "when pref_name = 'light_bathroom' then '"+req.body.light_bathroomOn+"' "+
            "end)," +

            "pref_stopTime = (case when pref_name = 'light_balcony' then '"+req.body.light_balconyOff+"' "+                                                          "when pref_name = 'light_livingRoom' then '"+req.body.light_livingRoomOff+"' "+
            "when pref_name = 'light_bedroom1' then '"+req.body.light_bedroom1Off+"' "+
            "when pref_name = 'light_bedroom2' then '"+req.body.light_bedroom2Off+"' "+
            "when pref_name = 'light_kitchen' then '"+req.body.light_kitchenOff+"' "+
            "when pref_name = 'light_hallway' then '"+req.body.light_hallwayOff+"' "+
            "when pref_name = 'light_bathroom' then '"+req.body.light_bathroomOff+"' "+
            "end) WHERE pref_name LIKE 'light_%';";

        db.run(sqlRequest, function (err) {

            if (err !== null) next(err);
            else {

                lightsData = '';

                ejsObject = generateEjsVariables(
                    "Lights",                        // Title of the page
                    "This is Light page",           // Heading of the page
                    "Lights' on/off time updated successfully",                             // msg status update
                    defaults.userMsg(req),               // after login Welcome user name
                    defaults.error,                           // error status
                    nav.full,                        // nav menu data
                    true,                            // isLoggedIn
                    defaults.userStatusData,         // all users status whether logged in or not
                    defaults.userEditData,           // modify users info
                    lightsData,             // lights data
                    defaults.gardensData             // gardens data
                );

                res.render("light.ejs", ejsObject);

            }
        });
    }

});

module.exports = lightsRouter;