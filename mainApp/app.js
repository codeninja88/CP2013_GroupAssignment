//-----------------------------------------------------------------//
//-------> MODULE DECLARATIONS & INITIALISATIONS <-----------------//

var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var userMsg = "";
var userStatusData = [];
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

function generateEjsVariables (title, body, msg, user, error, navMenu, isLoggedIn, userStatusData) {

    var ejsObject = {
        title: title,
        body: body,
        msg: msg,
        user: user,
        error: error,
        navMenu: navMenu,
        isLoggedIn: isLoggedIn,
        userStatusData: userStatusData
    }

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

        ejsObject = generateEjsVariables("Home", "This is Home page", "", userMsg, "", navMenu, true, userStatusData);

        res.render('index.ejs', ejsObject);

        printDebug(req, "HOME / INDEX");


    } else {

        navMenu = setNavContent('simple');

        userCheck(req);

        ejsObject = generateEjsVariables("Home", "This is Home page", "", userMsg, "", navMenu, false, userStatusData);

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

        ejsObject = generateEjsVariables("Admin", "This is Admin page", "", userMsg, "", navMenu, true, userStatusData);

        res.render('admin.ejs', ejsObject);

        printDebug(req, "ADMIN");

    } else {

        res.redirect('/');

    }

});


// GET LOGOUT
app.get('/logout', function(req, res) {

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

        ejsObject = generateEjsVariables("Doors/Gates", "This is Doors/Gates page", "", userMsg, "", navMenu, true, userStatusData);

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

        ejsObject = generateEjsVariables("Holiday Mode", "This is Holiday Mode page", "", userMsg, "", navMenu, true, userStatusData);

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

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        navMenu = setNavContent('full');

        userCheck(req);

        ejsObject = generateEjsVariables("Light", "This is Light page", "", userMsg, "", navMenu, true, userStatusData);

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

        ejsObject = generateEjsVariables("Logs", "This is Logs page", "", userMsg, "", navMenu, true, userStatusData);

        res.render('logs.ejs', ejsObject);

        printDebug(req, "LOGS");

    } else {

        res.redirect('/');

    }

});


//-----------------------------------------------------------//
//-------------> POST REQUESTS <----------------------------//

// POST --> ADD NEW USER
app.post('/admin',

    function(req, res, next) {

        var formName = req.body.formName;
        var sqlRequest;

        if (formName === 'createUser') {


            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var username = req.body.username;
            var password = req.body.password;
            var isAdmin = req.body.userLevel;

            sqlRequest= "INSERT INTO 'USER' (user_fName, user_lName, user_username, user_password, user_isAdmin) " +
            "VALUES('" + firstName + "', '" + lastName + "', '" + username + "', '" + password + "', '" + isAdmin + "')";

            db.run(sqlRequest,

                function (err) {

                    if (err !== null) next(err);
                    else {

                        res.redirect("/");

                    }
                }
            );

        } else if (formName === 'showStatus') {

            sqlRequest = "SELECT * FROM 'USER'";

            var navMenu = setNavContent('full');
            userCheck(req);
            var ejsObject;

            db.each(sqlRequest, function(err, row) {

                    //console.log(row.user_fName);
                    userStatusData = row;


                    ejsObject = generateEjsVariables("Admin", "This is Admin page", "", userMsg, "", navMenu, true, userStatusData);

                    res.render('admin.ejs', ejsObject);


                    console.log(userStatusData);

                }
            );


        }
    }
);



// POST -->  LOGIN
app.post('/',

    function(req, res) {

        db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', req.body.username, req.body.password,

            function(err, row) {

                var navMenu;
                var ejsObject;
                var errMsg = "ERROR:\t Invalid Username and/or password.";

                // query returns undefined if username entered does not exist in db
                if (row === undefined || !row.user_username) {

                    navMenu = setNavContent('simple');

                    userCheck(req);

                    ejsObject = generateEjsVariables("Home", "This is Home page", "", userMsg, errMsg, navMenu, false, userStatusData);

                    res.render('index.ejs', ejsObject);


                } else if (row.user_password === req.body.password) {

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