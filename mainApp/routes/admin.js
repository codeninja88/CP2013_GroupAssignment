var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');
var express = require('express');
var adminRouter = express.Router();

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



// GET ADMIN
adminRouter.get('/admin', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Admin",                        // Title of the page
            "This is Admin page",           // Heading of the page
            defaults.msg,                             // msg status update
            userMsg,               // after login Welcome user name
            defaults.error,                           // error status
            nav.full,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );

        res.render('admin.ejs', ejsObject);

        printDebug(req, "ADMIN");

    } else {

        res.redirect('/');

    }

});



// POST --> ADD/EDIT USERS
adminRouter.post('/admin',

    function(req, res, next) {

        var formName = req.body.formName;
        var sqlRequest;

        userCheck(req);

        if (formName === 'createUser') {

            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var username = req.body.username;
            var password = req.body.password;
            var isAdmin = req.body.userLevel;
            var address = req.body.address;
            var phone = req.body.phone;
            var email = req.body.email;


            sqlRequest= "INSERT INTO 'USER' (user_fName, user_lName, user_username, user_password, user_isAdmin, user_address, user_phone, user_email) " +
                "VALUES('"
                + firstName + "', '"
                + lastName + "', '"
                + username + "', '"
                + password + "', '"
                + isAdmin + "', '"
                + address + "', '"
                + phone + "', '"
                + email + "')";

            db.run(sqlRequest,

                function (err) {

                    if (err !== null) next(err);

                    else {

                        ejsObject = generateEjsVariables(
                            "Admin",                        // Title of the page
                            "This is Admin page",           // Heading of the page
                            "New user has been created successfully",                             // msg status update
                            userMsg,               // after login Welcome user name
                            defaults.error,                           // error status
                            nav.full,                        // nav menu data
                            true,                            // isLoggedIn
                            defaults.userStatusData,         // all users status whether logged in or not
                            defaults.userEditData,           // modify users info
                            defaults.lightsData,             // lights data
                            defaults.gardensData             // gardens data
                        );

                        res.render("admin.ejs", ejsObject);

                    }
                }
            );

        } else if (formName === 'showStatus') {

            sqlRequest = "SELECT * FROM 'USER'";

            var userStatusData = [];

            db.serialize(function() {

                db.each(sqlRequest, function(err, row) {

                    userStatusData.push({username: row.user_username, status: row.user_isLoggedIn})

                }, function (){

                    ejsObject = generateEjsVariables(
                        "Admin",                        // Title of the page
                        "This is Admin page",           // Heading of the page
                        defaults.msg,                             // msg status update
                        userMsg,               // after login Welcome user name
                        defaults.error,                           // error status
                        nav.full,                        // nav menu data
                        true,                            // isLoggedIn
                        userStatusData,         // all users status whether logged in or not
                        defaults.userEditData,           // modify users info
                        defaults.lightsData,             // lights data
                        defaults.gardensData             // gardens data
                    );

                    console.log(userStatusData);

                    res.render('admin.ejs', ejsObject);

                });

            });

        } else if (formName === 'showEdit') {

            sqlRequest = "SELECT * FROM 'USER'";

            var ejsObject;
            var userEditData = [];

            db.serialize(function() {

                db.each(sqlRequest, function(err, row) {

                    userEditData.push({
                        username: row.user_username,
                        fName: row.user_fName,
                        lName: row.user_lName,
                        isAdmin: row.user_isAdmin,
                        address: row.user_address,
                        phone: row.user_phone,
                        email: row.user_email,
                        startTime: row.user_startTime,
                        endTime: row.user_endTime
                    })

                }, function (){

                    ejsObject = generateEjsVariables(
                        "Admin",                        // Title of the page
                        "This is Admin page",           // Heading of the page
                        defaults.msg,                             // msg status update
                        userMsg,               // after login Welcome user name
                        defaults.error,                           // error status
                        nav.full,                        // nav menu data
                        true,                            // isLoggedIn
                        defaults.userStatusData,         // all users status whether logged in or not
                        userEditData,           // modify users info
                        defaults.lightsData,             // lights data
                        defaults.gardensData             // gardens data
                    );


                    console.log(userEditData);

                    res.render('admin.ejs', ejsObject);

                })

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

                            ejsObject = generateEjsVariables(
                                "Admin",                        // Title of the page
                                "This is Admin page",           // Heading of the page
                                "User details have been updated successfully",                             // msg status update
                                userMsg,               // after login Welcome user name
                                defaults.error,                           // error status
                                nav.full,                        // nav menu data
                                true,                            // isLoggedIn
                                defaults.userStatusData,         // all users status whether logged in or not
                                defaults.userEditData,           // modify users info
                                defaults.lightsData,             // lights data
                                defaults.gardensData             // gardens data
                            );

                            res.render("admin.ejs", ejsObject);

                        }

                    }

                );


            } else if (req.body.submitBttn === 'Delete User') {

                sqlRequest = "DELETE FROM 'USER' WHERE user_username = '" + req.body.username + "';";

                db.run(sqlRequest,
                    function (err) {

                        if (err !== null) next(err);
                        else {

                            ejsObject = generateEjsVariables(
                                "Admin",                        // Title of the page
                                "This is Admin page",           // Heading of the page
                                "User successfully deleted",                             // msg status update
                                userMsg,               // after login Welcome user name
                                defaults.error,                           // error status
                                nav.full,                        // nav menu data
                                true,                            // isLoggedIn
                                defaults.userStatusData,         // all users status whether logged in or not
                                defaults.userEditData,           // modify users info
                                defaults.lightsData,             // lights data
                                defaults.gardensData             // gardens data
                            );



                            res.render("admin.ejs", ejsObject);

                            console.log("USER DELETED");

                        }
                    }
                );

            }

        }

    }
);





module.exports = adminRouter;