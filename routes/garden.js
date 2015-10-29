var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');


var express = require('express');
var gardenRouter = express.Router();

var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");
var generateUserMsg = require('../modules/generateUserMsg.js');


// GET GARDEN
gardenRouter.get('/garden', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        ejsObject = ejsObjectFactory(
            {
                title: 'Garden',
                heading: 'Garden',
                navMenu: nav,
                isLoggedIn: true,
                username: generateUserMsg(req.session.username)
            }
        );

        res.render('garden.ejs', ejsObject);

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
                        isActive: row.pref_isActive,
                        sensorActivated: row.pref_sensorTriggered,
                    });

                }

            }, function (){

                ejsObject = ejsObjectFactory(
                    {
                        title: 'Garden',
                        heading: 'Garden',
                        navMenu: navMenu,
                        isLoggedIn: true,
                        gardensData: gardensData,
                        username: generateUserMsg(req.session.username)
                    }
                );

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

                ejsObject = ejsObjectFactory(
                    {
                        title: 'Garden',
                        heading: 'Garden',
                        navMenu: nav.full,
                        isLoggedIn: true,
                        msg: 'Garden on/off time updated successfully',
                        username: generateUserMsg(req.session.username)
                    }
                );

                res.render("garden.ejs", ejsObject);

            }
        });
    }

});

module.exports = gardenRouter;