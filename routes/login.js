var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');

var express = require('express');
var loginRoute = express.Router();

var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");
var generateUserMsg = require('../modules/generateUserMsg.js');


// POST -->  LOGIN
loginRoute.post('/',

    function(req, res, next) {

        db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', req.body.username, req.body.password,

            function(err, row) {

                var ejsObject;

                // query returns undefined if username entered does not exist in db
                if (row === undefined || !row.user_username) {

                    ejsObject = ejsObjectFactory(
                        {
                            title: 'Home',
                            heading: 'Admin',
                            navMenu: nav.simple,
                            msg: 'ERROR:\t Invalid username and/or password',
                            isLoggedIn: false,
                            username: generateUserMsg(req.session.username)
                        }
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

                }

            }
        );
    }
);


module.exports = loginRoute;