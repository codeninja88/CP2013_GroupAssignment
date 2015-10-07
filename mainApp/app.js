//-----------------------------------------------------------------//
//-------> MODULE DECLARATIONS & INITIALISATIONS <-----------------//

var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

//  custom modules
var nav = require("./modules/nav.js");
var generateEjsVariables = require("./modules/generateEjsVariables.js");
var defaults = require("./modules/defaults.js");


var db = new sqlite3.Database('database.sqlite');


var routes = require('./routes/index');


var app = express();

app.use(express.static(__dirname));


// SESSION SETUP
app.use(session({

        secret: 'agileisawesome',
        saveUninitialized: true,
        resave: true

    }
));


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



//----------------------------------------------------------//
//-------------> GET REQUESTS <----------------------------//



app.use('/', routes);




// GET ADMIN
app.get('/admin', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 1){


        userCheck(req);

        ejsObject = generateEjsVariables(
            "Admin",                        // Title of the page
            "This is Admin page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg,               // after login Welcome user name
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

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Doors and Gates",                        // Title of the page
            "This is Doors/Gates page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg,               // after login Welcome user name
            defaults.error,                           // error status
            nav,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            defaults.gardensData             // gardens data
        );

        res.render('doorGates.ejs', ejsObject);

        printDebug(req, "DOORS/GATES");

    }


});


// GET HOLIDAY MODE
app.get('/holidayMode', function(req, res) {

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
            defaults.userMsg,               // after login Welcome user name
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


// GET LIGHTS
app.get('/light', function(req, res) {

    var ejsObject;
    lightsData = '';

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.standard, lightsData);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full, lightsData);

    else res.redirect('/');


    function setInfo (nav, lightsData){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Lights",                        // Title of the page
            "This is Light page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg,               // after login Welcome user name
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


// GET GARDEN
app.get('/garden', function(req, res) {

    var ejsObject;

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username && req.session.isAdmin === 0) setInfo(nav.simple);

    else if (req.session.username && req.session.isAdmin === 1) setInfo(nav.full);

    else res.redirect('/');


    function setInfo (nav){

        userCheck(req);

        ejsObject = generateEjsVariables(
            "Garden",                        // Title of the page
            "This is Garden page",           // Heading of the page
            defaults.msg,                             // msg status update
            defaults.userMsg,               // after login Welcome user name
            defaults.error,                           // error status
            nav,                        // nav menu data
            true,                            // isLoggedIn
            defaults.userStatusData,         // all users status whether logged in or not
            defaults.userEditData,           // modify users info
            defaults.lightsData,             // lights data
            ''             // gardens data
        );

        res.render('garden.ejs', ejsObject);

        printDebug(req, "GARDEN");

    }

});


//-----------------------------------------------------------//
//-------------> POST REQUESTS <----------------------------//

// POST --> ADD/EDIT USERS
app.post('/admin',

    function(req, res, next) {

        var formName = req.body.formName;
        var sqlRequest;
        //var msg;
        //var userStatusData = [];
        //var userEditData = [];
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
                            defaults.userMsg,               // after login Welcome user name
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

            userCheck(req);
            //var ejsObject;
            var userStatusData = [];

            db.serialize(function() {

                db.each(sqlRequest, function(err, row) {

                    userStatusData.push({username: row.user_username, status: row.user_isLoggedIn})

                }, function (){

                    ejsObject = generateEjsVariables(
                        "Admin",                        // Title of the page
                        "This is Admin page",           // Heading of the page
                        defaults.msg,                             // msg status update
                        defaults.userMsg,               // after login Welcome user name
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

            userCheck(req);
            var ejsObject;
            var userEditData = [];
            //var userStatusData = [];


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
                        defaults.userMsg,               // after login Welcome user name
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
                                defaults.userMsg,               // after login Welcome user name
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
                                defaults.userMsg,               // after login Welcome user name
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



// POST -->  LOGIN
app.post('/',

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





// POST -->  LIGHTS
app.post('/light', function(req, res, next) {

    var formName = req.body.formName;
    var sqlRequest;
    var lightsData = '';
    userCheck(req);

    if (formName === 'showLightTimes') {

        sqlRequest = "SELECT * FROM 'PREFERENCE'";
        if (req.session.isAdmin === 0) {
            var navMenu = nav.simple;
        } else {
            var navMenu = nav.full;
        }


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
                        stopTime: row.pref_stopTime,
                        isActive: row.pref_isActive
                    });

                }

            }, function (){

                ejsObject = generateEjsVariables(
                    "Lights",                        // Title of the page
                    "This is Light page",           // Heading of the page
                    defaults.msg,                             // msg status update
                    defaults.userMsg,               // after login Welcome user name
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
                userCheck(req);

                //var ejsObject;
                //var userEditData = [];
                //var userStatusData = [];
                lightsData = '';

                ejsObject = generateEjsVariables(
                    "Lights",                        // Title of the page
                    "This is Light page",           // Heading of the page
                    "Lights' on/off time updated successfully",                             // msg status update
                    defaults.userMsg,               // after login Welcome user name
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

// POST -->  GARDEN
app.post('/garden', function(req, res, next) {

    var formName = req.body.formName;
    var sqlRequest;
    var gardensData = '';
    userCheck(req);

    if (formName === 'showGardenTimes') {

        sqlRequest = "SELECT * FROM 'PREFERENCE'";
        if (req.session.isAdmin === 0) {
            var navMenu = nav.simple;
        } else {
            var navMenu = nav.full;
        }


        userCheck(req);
        var ejsObject;
        var userEditData = [];
        var userStatusData = [];
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
                    defaults.msg,                             // msg status update
                    defaults.userMsg,               // after login Welcome user name
                    defaults.error,                           // error status
                    navMenu,                        // nav menu data
                    true,                            // isLoggedIn
                    defaults.userStatusData,         // all users status whether logged in or not
                    defaults.userEditData,           // modify users info
                    defaults.lightsData,             // lights data
                    gardensData             // gardens data
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
                userCheck(req);
                //var ejsObject;
                //var userEditData = [];
                //var userStatusData = [];
                var gardensData = '';

                ejsObject = generateEjsVariables(
                    "Garden",                        // Title of the page
                    "This is Garden page",           // Heading of the page
                    "Garden on/off time updated successfully",                             // msg status update
                    defaults.userMsg,               // after login Welcome user name
                    defaults.error,                           // error status
                    navMenu,                        // nav menu data
                    true,                            // isLoggedIn
                    defaults.userStatusData,         // all users status whether logged in or not
                    defaults.userEditData,           // modify users info
                    defaults.lightsData,             // lights data
                    gardensData             // gardens data
                );

                res.render("garden.ejs", ejsObject);

            }
        });
    }

});





// timer for lights
setInterval( function() {


    sqlRequest = "SELECT * FROM 'PREFERENCE'";
    var allData = [];
    var time24 = convertTo24Hour();

    db.serialize(function() {

        db.each(sqlRequest, function(err, row) {

            allData.push({
                pref_name: row.pref_name,
                startTime: row.pref_startTime,
                stopTime: row.pref_stopTime
            })


        }, function (){

            allData.forEach(function(data) {


                    var sqlRequest;

                    var startTime = data.startTime.toString().trim();
                    var stopTime = data.stopTime.toString().trim();
                    var systemTime = time24.toString().trim();
                    var pref_name = data.pref_name.toString().trim();


                    if (startTime.localeCompare(systemTime) === 0 || (systemTime > startTime && systemTime < stopTime)) {

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1 WHERE pref_name = '" + pref_name+ "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });

                    }

                    if (stopTime.localeCompare(systemTime) === 0 || (systemTime < startTime || systemTime > stopTime)) {

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);


                        });

                    }

            });

        })

    });





    //var time = formatAMPM(date);

// CONVERTING SYSTEM TIME FORMAT TO CHECK WITH SQL DATE DATA
    function convertTo24Hour() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var time = hours + ':' + minutes + ' ' + ampm;

        var hours = parseInt(time.substr(0, 2));
        if(time.indexOf('am') != -1 && hours == 12) {
            time = time.replace('12', '0');
        }
        if(time.indexOf('pm')  != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/(am|pm)/, '');
    }


}, 1000);