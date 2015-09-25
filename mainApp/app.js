//-----------------------------------------------------------------//
//-------> MODULE DECLARATIONS & INITIALISATIONS <-----------------//

var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var userMsg = "";
var active = "color:white";
var userStatusData = [];
var userEditData = [];
var lightsData = [];
var db = new sqlite3.Database('database.sqlite');

var app = express();

app.use(express.static(__dirname));

// SESSION SETUP
app.use(
    session(
        {
            secret: 'agileisawesome',
            saveUninitialized: true,
            resave: true

        }
    )
);



//---------------------------------------------------------------//
//-------------> HELPER FUNCTIONS  <----------------------------//


// CHECK IF USER IS LOGGED IN SUCCESSFULLY
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

//--------------------------------------------------------------//
//----------------------> SETUP   <----------------------------//



app.set('view engine', 'ejs');
app.locals.pretty = true; // makes sure code is readable in JS console

app.use(express.static("public"));
app.use(
    bodyParser.urlencoded(
        {
            extended: true
        }
    )
);


app.listen(
    process.env.PORT || 3000, function() {
        console.log("running at --> http://localhost:3000/");
    });


function setNavContent (navType) {
    var navMenu;

    if (navType === 'simple') {

        navMenu = [
            { navButton: '/', buttonName: 'Home' }
        ];

    } else if (navType === 'full') {
        navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' }
        ];
    }

    return navMenu;

}

function generateEjsVariables (title, body, msg, user, error, navMenu, isLoggedIn, userStatusData, userEditData, lightsData) {

    var ejsObject = {
        title: title,
        body: body,
        msg: msg,
        user: user,
        error: error,
        navMenu: navMenu,
        isLoggedIn: isLoggedIn,
        userStatusData: userStatusData,
        userEditData: userEditData,
        currentPage: active,
        lightsData: lightsData
    };

    return ejsObject;

}


//----------------------------------------------------------//
//-------------> GET REQUESTS <----------------------------//

// GET HOME
app.get('/', function(req, res) {

    var navMenu;
    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Home", "This is Home page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

        res.render('index.ejs', ejsObject);

        printDebug(req, "HOME / INDEX");


    } else {

        navMenu = setNavContent('simple');


        userCheck(req);

        ejsObject = generateEjsVariables("Home", "This is Home page", "", userMsg, "", navMenu, false, userStatusData, userEditData);

        res.render('index.ejs', ejsObject);

        printDebug(req, "HOME / INDEX");
    }

});



// GET ADMIN
app.get('/admin', function(req, res) {

    var navMenu;
    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Admin", "This is Admin page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

        res.render('admin.ejs', ejsObject);

        printDebug(req, "ADMIN");

    } else {

        res.redirect('/');

    }

});


// GET LOGOUT
app.get('/logout', function(req, res) {

    // Changing login status in database back to offline
    db.run("UPDATE 'USER' SET user_isLoggedIn = ? WHERE user_username = ?", 0, req.session.username, function (err) {

        if (err !== null) next(err);

    });

    req.session.destroy();
    res.redirect('/');
    console.log("Session successfully destroyed\n");

});



// GET DOORS/GATES
app.get('/doorGates', function(req, res) {

    var navMenu;
    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Doors and Gates", "This is Doors/Gates page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

        res.render('doorGates.ejs', ejsObject);

        printDebug(req, "DOORS/GATES");

    } else {

        res.redirect('/');

    }

});


// GET HOLIDAY MODE
app.get('/holidayMode', function(req, res) {

    var navMenu;
    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Holiday Mode", "This is Holiday Mode page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

        res.render('holidayMode.ejs',ejsObject);

        printDebug(req, "HOLIDAY MODE");

    } else {

        res.redirect('/');

    }

});


// GET LIGHTS
app.get('/light', function(req, res) {

    var navMenu;
    var ejsObject;
    lightsData = '';

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Lights", "This is Light page", "", userMsg, "", navMenu, true, userStatusData, userEditData, lightsData);

        res.render('light.ejs', ejsObject);

        printDebug(req, "LIGHT");

    } else {

        res.redirect('/');

    }

});


// GET LOGS
app.get('/logs', function(req, res) {

    var navMenu;
    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Logs", "This is Logs page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

        res.render('logs.ejs', ejsObject);

        printDebug(req, "LOGS");

    } else {

        res.redirect('/');

    }

});


//-----------------------------------------------------------//
//-------------> POST REQUESTS <----------------------------//

// POST --> ADD/EDIT USERS
app.post('/admin',

    function(req, res, next) {

        var formName = req.body.formName;
        var sqlRequest;
        var msg;
        var userStatusData = [];
        var userEditData = [];
        navMenu = setNavContent('full');
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
                        msg = "New user has been created successfully";
                        ejsObject = generateEjsVariables("Admin", "This is Admin page", msg, userMsg, "", navMenu, true, userStatusData, userEditData);
                        res.render("admin.ejs", ejsObject);

                    }
                }
            );

        } else if (formName === 'showStatus') {

            sqlRequest = "SELECT * FROM 'USER'";

            var navMenu = setNavContent('full');
            userCheck(req);
            var ejsObject;
            var userStatusData = [];
            var userEditData = [];


            db.serialize(function() {

                db.each(sqlRequest, function(err, row) {

                    userStatusData.push({username: row.user_username, status: row.user_isLoggedIn})

                }, function (){

                    ejsObject = generateEjsVariables("Admin", "This is Admin page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

                    console.log(userStatusData);

                    res.render('admin.ejs', ejsObject);

                });

            });

        } else if (formName === 'showEdit') {

            sqlRequest = "SELECT * FROM 'USER'";

            var navMenu = setNavContent('full');
            userCheck(req);
            var ejsObject;
            var userEditData = [];
            var userStatusData = [];


            db.serialize(function() {

                db.each(sqlRequest, function(err, row) {

                    userEditData.push({
                        username: row.user_username,
                        fName: row.user_fName,
                        lName: row.user_lName,
                        isAdmin: row.user_isAdmin,
                        address: row.user_address,
                        phone: row.user_phone,
                        email: row.user_email
                    })

                }, function (){

                    ejsObject = generateEjsVariables("Admin", "This is Admin page", "", userMsg, "", navMenu, true, userStatusData, userEditData);

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
                "user_email = '" + req.body.email + "'" +
                " WHERE user_username = '" + req.body.username + "';";


                db.run(sqlRequest,

                    function (err) {

                        if (err !== null) next(err);
                        else {

                            msg = "User details have been updated successfully";
                            ejsObject = generateEjsVariables("Admin", "This is Admin page", msg, userMsg, "", navMenu, true, userStatusData, userEditData);
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

                            msg = "User successfully deleted";
                            ejsObject = generateEjsVariables("Admin", "This is Admin page", msg, userMsg, "", navMenu, true, userStatusData, userEditData);
                            res.render("admin.ejs", ejsObject);
                            console.log("USER DELETED");

                        }
                    }
                );

            }


        }

    }
);



// POST -->  LOGIN
app.post('/',

    function(req, res, next) {

        db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', req.body.username, req.body.password,

            function(err, row) {

                var navMenu;
                var ejsObject;
                var errMsg = "ERROR:\t Invalid username and/or password.";

                // query returns undefined if username entered does not exist in db
                if (row === undefined || !row.user_username) {

                    navMenu = setNavContent('simple');

                    userCheck(req);

                    ejsObject = generateEjsVariables("Home", "This is Home page", "", userMsg, errMsg, navMenu, false, userStatusData, userEditData);

                    res.render('index.ejs', ejsObject);


                } else if (row.user_password === req.body.password) {

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





// POST -->  LIGHTS
app.post('/light', function(req, res, next) {

    var formName = req.body.formName;
    var sqlRequest;
    var lightsData = '';
    userCheck(req);

    if (formName === 'showLightTimes') {

        sqlRequest = "SELECT * FROM 'PREFERENCE'";

        var navMenu = setNavContent('full');
        userCheck(req);
        var ejsObject;
        var userEditData = [];
        var userStatusData = [];
        lightsData = [];


        db.serialize(function() {

            db.each(sqlRequest, function(err, row) {

                if (row.pref_name.startsWith('light')) {

                    lightsData.push({
                        lightName: row.pref_name,
                        startTime: row.pref_startTime,
                        stopTime: row.pref_stopTime
                    })

                }

            }, function (){

                ejsObject = generateEjsVariables("Lights", "This is Light page", "", userMsg, "", navMenu, true, userStatusData, userEditData, lightsData);

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
                                "end)";

        db.run(sqlRequest, function (err) {

            if (err !== null) next(err);
            else {
                var navMenu = setNavContent('full');
                userCheck(req);
                var ejsObject;
                var userEditData = [];
                var userStatusData = [];
                lightsData = '';
                var msg = "Lights' on/off time updated successfully";

                ejsObject = generateEjsVariables("Lights", "This is Light page", msg, userMsg, "", navMenu, true, userStatusData, userEditData, lightsData);

                res.render("light.ejs", ejsObject);

            }
        });
    }

});


