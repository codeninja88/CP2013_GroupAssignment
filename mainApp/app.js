var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');

var session = require('express-session');
var db = new sqlite3.Database('../DBRevised.sqlite');

var app = express();
app.set('view engine', 'ejs');
app.locals.pretty = true;

//app.use("/styles",express static(__dirname+"/style"));

//middle-ware (to send data to server i think)
app.use(bodyParser.urlencoded({extended: true}));



//app.use(cookieParser());
app.use(session({
    secret: 'agileisawesome',
    saveUninitialized: true,
    resave: true
}));




// setting index.ejs as main/home page and other routes
app.get('/', function(req, res) {
    res.render('index.ejs', {
    title: "Home",
    body: "This is Home page",
    msg: ""
  });

    console.log(req.session);
    console.log(req.session.username);
    console.log(req.session.isAdmin);
    
});

app.get('/signup', function(req, res) {
  res.render('signup.ejs', {
    title: "Login",
    error: ""
  });

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
    error: ""
    //msg:""
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
      res.render('index.ejs', {title: 'HOME', msg: 'You have successfully signed up and logged in ' + firstName.toUpperCase()})
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
      res.render('index.ejs', {error: 'Invalid username or password.'});
    } else {
      if (row.user_password === password) {
        
          
        req.session.username = username;         
        req.session.isAdmin = row.user_isAdmin;

          
        res.render('index.ejs', {title: 'HOME', msg: 'You are successfully logged in ' + username.toUpperCase()});
          
          
        console.log("logged in successfully.");

          
      } else {
        console.log("invalid login details");
        res.render('login.ejs', {error: 'Invalid username or password.'});
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("running at --> http://localhost:3000/")
});
