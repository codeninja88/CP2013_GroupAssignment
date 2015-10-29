var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');


var express = require('express');
var lightsRouter = express.Router();


var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");


// GET LIGHTS
lightsRouter.get('/light', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        ejsObject = ejsObjectFactory(
            {
                title: 'Lights',
                heading: 'Lights',
                navMenu: nav,
                isLoggedIn: true,
                username: req.session.username
            }
        );

        res.render('light.ejs', ejsObject);


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
                        isActive: row.pref_isActive,
                        sensorActivated: row.pref_sensorTriggered
                    });

                }

            }, function (){


                ejsObject = ejsObjectFactory(
                    {
                        title: 'Lights',
                        heading: 'Lights',
                        navMenu: navMenu,
                        isLoggedIn: true,
                        lightsData: lightsData,
                        username: req.session.username
                    }
                );

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

                ejsObject = ejsObjectFactory(
                    {
                        title: 'Lights',
                        heading: 'Lights',
                        navMenu: nav.full,
                        isLoggedIn: true,
                        msg: 'lights on/off time updated successfully',
                        username: req.session.username
                    }
                );

                res.render("light.ejs", ejsObject);

            }
        });
    }

});

module.exports = lightsRouter;