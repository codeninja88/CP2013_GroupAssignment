var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var db = new sqlite3.Database('../DBRevised.sqlite');

var app = express();
app.set('view engine', 'ejs');
app.locals.pretty = true;

app.use("/styles",express static(__dirname+"/style"));

//middle-ware (to send data to server i think)
app.use(bodyParser.urlencoded({extended: true}));

// setting index.ejs as main/home page and other routes
app.get('/', function(req, res) {
  res.render('index.ejs', {
    title: "Home",
    body: "This is Home page"
  });
});

app.get('/register', function(req, res) {
  res.render('register.ejs');
});

app.get('/dashboard', function(req, res) {
  res.render('dashboard.ejs');
});

app.get('/logout', function(req, res) {
  res.redirect('/');
});

app.get('/login', function(req, res) {
  res.render('login.ejs', {
    title: "Login",
    //body: ""
  });
});

//post req adding new user to the sqlite database
app.post('/register', function(req, res, next) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  var sqlRequest = "INSERT INTO 'USER' (USER_fName, USER_lName, USER_email, USER_password) " +
               "VALUES('" + firstName + "', '" + lastName + "', '" + email + "', '" + password + "')"
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      next(err);
    }
    else {
      res.render('dashboard.ejs', {msg: 'You have successfully registered and logged in ' + firstName.toUpperCase()})
    }
  });
  //on post req data will be sent using middle-ware "body parser" library
  //res.json(req.body);
});

// login authentication
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.get('SELECT * FROM USER WHERE user_username = ? AND user_password = ?', username, password, function(err, row) {

    //query returns undefined if ? === 'email entered by user that does not exist in db'
    if (row === undefined || !row.user_username){
      res.render('login.ejs', {error: 'Invalid email or password.'});
    } else {
      if (row.user_password === password) {
        res.render('dashboard.ejs', {msg: 'You are successfully logged in ' + row.user_fName.toUpperCase()});
        console.log("logged in successfully.");
      } else {
        console.log("invalid login details");
        res.render('login.ejs', {error: 'Invalid email or password.'});
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("running at --> http://localhost:3000/")
});
