var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var db = new sqlite3.Database('../DBRevised.sqlite');

var app = express();
app.set('view engine', 'ejs');
app.locals.pretty = true;

//app.use("/styles",express.static(__dirname + "/styles"));
app.use( express.static("public"));
//app.use( express.static("views/styles"));

//middle-ware
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'agileisawesome',
    saveUninitialized: true,
    resave: true
}));

// setting index.ejs as main/home page and other routes
app.get('/', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
    
    res.render('index.ejs', {
    title: "Home",
    body: "This is Home page",
    msg: "",
    user: userMsg,
    error: ""
  });

    console.log(req.session);
    console.log(req.session.username);
    console.log(req.session.isAdmin);

});

app.get('/signup', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
    
    res.render('signup.ejs', {
        title: "Signup",
        body: "This is Signup page",
        msg: "",
        user: userMsg,
        error: ""
    });
        console.log(req.session.username);
        console.log(req.session.isAdmin);

});

app.get('/admin', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
    res.render('admin.ejs', {
        title: "admin",
        body: "This is Admin page",
        msg: "",
        user: userMsg,
        error: ""
    });
});

app.get('/logout', function(req, res) {
    res.redirect('/');
    req.session.destroy();
    console.log(req.session.username);
    console.log(req.session);

});

app.get('/login', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
      res.render('login.ejs', {
        title: "Login",
        error: "",
        user: userMsg,
        msg:""
      });

});

app.get('/doorGates', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
    
      res.render('doorGates.ejs', {
        title: "door Gates",
        body: "This is doorGates page",
        msg: "",
        user: userMsg,
        error: ""
      });
});

app.get('/holidayMode', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
    
      res.render('holidayMode.ejs', {
        title: "holidayMode",
        body: "This is holidayMode page",
        msg: "",
        user: userMsg,
        error: ""
      });
});

app.get('/light', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
      res.render('light.ejs', {
        title: "light",
        body: "This is light page",
        msg: "",
        user: userMsg,
        error: ""
      });
});

app.get('/logs', function(req, res) {
    // chcking if session created for user after login
    var userMsg;
    if (req.session.username) {
        userMsg = 'Welcome ' + req.session.username.toUpperCase();
    } else {
        userMsg = "";
    }
      res.render('logs.ejs', {
        title: "logs",
        body: "This is logs page",
        msg: "",
        user: userMsg,
        error: ""
      });
});

//post req adding new user to the sqlite database
app.post('/signup', function(req, res, next) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var username = req.body.username;
  var password = req.body.password;
  var sqlRequest = "INSERT INTO 'USER' (user_fName, user_lName, user_username, user_password) " +
               "VALUES('" + firstName + "', '" + lastName + "', '" + username + "', '" + password + "')"
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      next(err);
    }
    else {
      res.render('index.ejs', {
        title: 'HOME',
        body: "",
        error: "",
        user: "",
        msg: ""
      });
    }
  });
});

// login authentication
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', username, password, function(err, row) {

    //query returns undefined if ? === 'username entered by user that does not exist in db'
    if (row === undefined || !row.user_username){
      res.render('login.ejs', {
        title: "Login",
        body: "",
        msg: "",
        user: "",
        error: 'Invalid username or password.'
      });
    } else {
      if (row.user_password === password) {
        req.session.username = username;
        req.session.isAdmin = row.user_isAdmin;
        res.render('index.ejs', {
            title: "Home",
            body: "",
            error: "",
            user: 'Welcome ' + req.session.username.toUpperCase(),
            msg: ""
        });
        console.log("logged in successfully.");

      } else {
        console.log("invalid login details");
        res.render('login.ejs', {
        title: "Login",
        body: "",
        msg: "",
        user: "",
        error: 'Invalid username or password.'
      });
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("running at --> http://localhost:3000/")
});