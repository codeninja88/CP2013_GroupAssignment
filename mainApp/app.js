





//-----------------------------------------------------------------//
//-------> MODULE DECLARATIONS & INITIALISATIONS <-----------------//

var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var userMsg = "";
var db = new sqlite3.Database('database.sqlite');

var app = express();

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
    process.env.PORT || 3000,
    function() {
        console.log("running at --> http://localhost:3000/");
    }
);






//----------------------------------------------------------//
//-------------> GET REQUESTS <----------------------------//

// GET HOME
app.get('/',

<<<<<<< Updated upstream
    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

        res.render('index.ejs',
            {
                title: "Home",
                body: "This is Home page",
                msg: "",
                user: userMsg,
                error: "",
                navMenu: navMenu,
                login: ''
            }
        );

        printDebug(req, "HOME / INDEX");


    } else {

        var navMenu = [
            { navButton: '/', buttonName: 'Home' }
        ];

=======
    function(req, res) {

>>>>>>> Stashed changes
        userCheck(req);

        res.render('index.ejs',
            {
                title: "Home",
                body: "This is Home page",
                msg: "",
                user: userMsg,
<<<<<<< Updated upstream
                error: "",
                navMenu: navMenu,
                login: '##'
            }
        );

        printDebug(req, "HOME / INDEX");
    }

=======
                error: ""
            }
        );

        printDebug(req, "HOME / INDEX");
>>>>>>> Stashed changes

    }
);



// GET SIGN UP
<<<<<<< Updated upstream
app.get('/createUser', function(req, res) {

    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

        res.render('createUser.ejs',
            {
                title: "createUser",
                body: "This is createUser page",
                msg: "",
                user: userMsg,
                error: "",
                navMenu: navMenu
            }
        );

        printDebug(req, "createUser");


    } else {

        res.redirect('/');

    }

=======
app.get('/signup',

    function(req, res) {

        userCheck(req);

        res.render('signup.ejs',
            {
                title: "Signup",
                body: "This is Signup page",
                msg: "",
                user: userMsg,
                error: ""
            }
        );

        printDebug(req, "SIGNUP");
>>>>>>> Stashed changes

    }
);



// WORKING HERE^^^^^^^^^^^^^^^^^^^^^^^



// GET ADMIN
app.get('/admin',
    function(req, res) {

<<<<<<< Updated upstream
    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

        res.render('admin.ejs',
            {
                title: "admin",
                body: "This is Admin page",
                msg: "",
                user: userMsg,
                error: "",
                navMenu: navMenu
            }
        );

        printDebug(req, "ADMIN");

    } else {

        res.redirect('/');

    }

=======
        userCheck(req);

        res.render('admin.ejs',
            {
                title: "admin",
                body: "This is Admin page",
                msg: "",
                user: userMsg,
                error: ""
            }
        );

        printDebug(req, "ADMIN");
>>>>>>> Stashed changes

    }
);


// GET LOGOUT
<<<<<<< Updated upstream
app.get('/logout', function(req, res) {

    req.session.destroy();
    res.redirect('/');
    console.log("Session successfully destroyed\n");
=======
app.get('/logout',
    function(req, res) {

        res.redirect('/');
        req.session.destroy();
        console.log("Session successfully destroyed\n");
>>>>>>> Stashed changes


    }
);


// GET LOG IN
app.get('/login',
    function(req, res) {

<<<<<<< Updated upstream
    //var navMenu = getNavInfo(navMenu);
    var navMenu = [
        { navButton: '/', buttonName: 'Home' },
        { navButton: 'admin', buttonName: 'Admin' },
        { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
        { navButton: 'doorGates', buttonName: 'Doors and Gates' },
        { navButton: 'light', buttonName: 'Lights' },
        { navButton: 'logs', buttonName: 'Logs' },
        { navButton: 'createUser', buttonName: 'Create User' }
    ];


    userCheck(req);

    res.render('login.ejs',
        {
            title: "Login",
            error: "",
            user: userMsg,
            msg:"",
            navMenu: navMenu
        }
    );
=======
        userCheck(req);

        res.render('login.ejs',
            {
                title: "Login",
                error: "",
                user: userMsg,
                msg:""
            }
        );
>>>>>>> Stashed changes

        printDebug(req, "LOGIN");

    }
);


// GET DOORS/GATES
app.get('/doorGates',
    function(req, res) {

<<<<<<< Updated upstream
    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

        res.render('doorGates.ejs',

            {
                title: "door Gates",
                body: "This is doorGates page",
                msg: "",
                user: userMsg,
                error: "",
                navMenu: navMenu
            }
        );

        printDebug(req, "DOORS/GATES");

    } else {

        res.redirect('/');

    }
=======
        userCheck(req);

        res.render('doorGates.ejs',
            {
                title: "door Gates",
                body: "This is doorGates page",
                msg: "",
                user: userMsg,
                error: ""
            }
        );

        printDebug(req, "DOORS/GATES");
>>>>>>> Stashed changes

    }
);


// GET HOLIDAY MODE
app.get('/holidayMode',
    function(req, res) {

<<<<<<< Updated upstream
    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

        res.render('holidayMode.ejs',
            {
                title: "holidayMode",
                body: "This is holidayMode page",
                msg: "",
                user: userMsg,
                error: "",
                navMenu: navMenu
            }
        );

        printDebug(req, "HOLIDAY MODE");

    } else {

        res.redirect('/');

    }
=======
        userCheck(req);

        res.render('holidayMode.ejs',
            {
                title: "holidayMode",
                body: "This is holidayMode page",
                msg: "",
                user: userMsg,
                error: ""
            }
        );

        printDebug(req, "HOLIDAY MODE");
>>>>>>> Stashed changes

    }
);


// GET LIGHTS
app.get('/light',
    function(req, res) {

<<<<<<< Updated upstream
    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

=======
        userCheck(req);
>>>>>>> Stashed changes
        res.render('light.ejs',
            {
                title: "light",
                body: "This is light page",
                msg: "",
                user: userMsg,
<<<<<<< Updated upstream
                error: "",
                navMenu: navMenu
            }
        );

        printDebug(req, "LIGHT");

    } else {

        res.redirect('/');

    }
=======
                error: ""
            }
        );

        printDebug(req, "LIGHT");
>>>>>>> Stashed changes

    }
);


// GET LOGS
app.get('/logs',
    function(req, res) {

<<<<<<< Updated upstream
    //Checking if user logged in otherwise redirecting to home page
    if (req.session.username){

        //setting nav info to pass client side/browser for display
        var navMenu = [
            { navButton: '/', buttonName: 'Home' },
            { navButton: 'admin', buttonName: 'Admin' },
            { navButton: 'holidayMode', buttonName: 'Holiday Mode' },
            { navButton: 'doorGates', buttonName: 'Doors and Gates' },
            { navButton: 'light', buttonName: 'Lights' },
            { navButton: 'logs', buttonName: 'Logs' },
            { navButton: 'createUser', buttonName: 'Create User' }
        ];

        userCheck(req);

        res.render('logs.ejs',
            {
                title: "logs",
                body: "This is logs page",
                msg: "",
                user: userMsg,
                error: "",
                navMenu: navMenu
            }
        );

        printDebug(req, "LOGS");

    } else {

        res.redirect('/');

    }
=======
        userCheck(req);

        res.render('logs.ejs',
            {
                title: "logs",
                body: "This is logs page",
                msg: "",
                user: userMsg,
                error: ""
            }
        );

        printDebug(req, "LOGS");
>>>>>>> Stashed changes

    }
);







//-----------------------------------------------------------//
//-------------> POST REQUESTS <----------------------------//

// POST --> ADD NEW USER
app.post('/createUser',

    function(req, res, next) {

        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        var password = req.body.password;

        var sqlRequest = "INSERT INTO 'USER' (user_fName, user_lName, user_username, user_password) " +
            "VALUES('" + firstName + "', '" + lastName + "', '" + username + "', '" + password + "')";

        db.run(sqlRequest,

            function(err) {

                if (err !== null) next(err);
                else {

                    res.redirect("/");

                }
            }
        );
    }
);



// POST -->  LOGIN
app.post('/',

    function(req, res) {

        db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', req.body.username, req.body.password,

            function(err, row) {

                var errMsg = "ERROR:\t Invalid username / password combination.";

                // query returns undefined if username entered does not exist in db
                if (row === undefined || !row.user_username) {

                    res.render('login.ejs',

                        {

                            title: "Login",
                            body: "",
                            msg: "",
                            user: "",
                            error: errMsg

                        }

                    );



                } else {

                    if (row.user_password === req.body.password) {

                        req.session.username = req.body.username;
                        req.session.isAdmin = row.user_isAdmin;


                        res.redirect("/");


                        console.log("Logged in successfully.");
                        printDebug(req, "INDEX");

                    } else {

                        console.log(errMsg);

                        res.render('login.ejs',

                            {
                                title: "Login",
                                body: "",
                                msg: "",
                                user: "",
                                error: errMsg

                            }

                        );
                    }
                }
            }
        );
    }
);

