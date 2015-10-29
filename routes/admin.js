var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');

var express = require('express');
var adminRouter = express.Router();

var database = require("../modules/database.js");

var nav = require("../modules/nav.js");
var ejsObjectFactory = require("../modules/ejsObjectFactory.js");
var generateUserMsg = require('../modules/generateUserMsg.js');



// GET ADMIN
adminRouter.get('/admin', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        ejsObject = ejsObjectFactory(
            {
                title: 'Admin',
                heading: 'Admin',
                navMenu: nav.full,
                isLoggedIn: true,
                username: generateUserMsg(req.session.username)

            }
        );


        res.render('admin.ejs', ejsObject);


    } else {

        res.redirect('/');

    }

});



// POST --> ADD/EDIT USERS
adminRouter.post('/admin',

    function(req, res, next) {

        var formName = req.body.formName;
        var sqlRequest;

        database.connect();

        if (formName === 'createUser') {


            database.insert("USER", {

                user_fName: req.body.firstName,
                user_lName: req.body.lastName,
                user_username: req.body.username,
                user_password: req.body.password,
                user_isAdmin: req.body.userLevel,
                user_address: req.body.address,
                user_phone: req.body.phone,
                user_email: req.body.email

            });


            ejsObject = ejsObjectFactory(
                {
                    title: 'Admin',
                    heading: 'Admin',
                    navMenu: nav.full,
                    isLoggedIn: true,
                    msg: 'New user has been created successfully',
                    username: generateUserMsg(req.session.username)
                }
            );

            res.render("admin.ejs", ejsObject);



        } else if (formName === 'showStatus') {

            database.selectAll('USER',

                function (results) {

                    ejsObject = ejsObjectFactory(
                        {
                            title: 'Admin',
                            heading: 'Admin',
                            navMenu: nav.full,
                            userStatusData: results,
                            isLoggedIn: true,
                            username: generateUserMsg(req.session.username)
                        }
                    );


                res.render('admin.ejs', ejsObject);

            });


        } else if (formName === 'showEdit') {

            database.selectAll('USER',

                function (results) {

                    ejsObject = ejsObjectFactory(
                        {
                            title: 'Admin',
                            heading: 'Admin',
                            navMenu: nav.full,
                            isLoggedIn: true,
                            userEditData: results,
                            username: generateUserMsg(req.session.username)
                        }
                    );


                    res.render('admin.ejs', ejsObject);

                });




        }

        else if (formName === 'saveChanges') {

            if (req.body.submitBttn === 'Save') {

                sqlRequest = "UPDATE 'USER' SET " +
                    "user_fName = '" + req.body.fName + "', " +
                    "user_lName = '" + req.body.lName + "', " +
                    "user_address = '" + req.body.address + "', " +
                    "user_isAdmin = '" + req.body.userLevel + "', " +
                    "user_phone = '" + req.body.phone + "', " +
                    "user_email = '" + req.body.email + "'";

                if (req.body.userLevel == 0) {
                    sqlRequest +=
                        ", user_startTime = '" + req.body.startTime + "', " +
                        "user_endTime = '" + req.body.endTime + "'";
                }

                sqlRequest += " WHERE user_username = '" + req.body.username + "';";


                db.run(sqlRequest,

                    function (err) {

                        if (err !== null) next(err);
                        else {

                            ejsObject = ejsObjectFactory(
                                {
                                    title: 'Admin',
                                    heading: 'Admin',
                                    navMenu: nav.full,
                                    isLoggedIn: true,
                                    msg: 'User details have been updated successfully',
                                    username: generateUserMsg(req.session.username)
                                }
                            );

                            res.render("admin.ejs", ejsObject);

                        }

                    }

                );


            } else if (req.body.submitBttn === 'Delete User') {

                database.remove("USER", {
                    user_username: req.body.username
                });

                ejsObject = ejsObjectFactory(
                    {
                        title: 'Admin',
                        heading: 'Admin',
                        navMenu: nav.full,
                        isLoggedIn: true,
                        msg: 'User successfully deleted',
                        username: generateUserMsg(req.session.username)
                    }
                );

                res.render("admin.ejs", ejsObject);

            }

        }

    }
);


module.exports = adminRouter;