var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');

var express = require('express');
var logoutRoute = express.Router();

var nav = require("../modules/nav.js");


// GET LOGOUT
logoutRoute.get('/', function(req, res) {

    // Changing login status in database back to offline
    db.run("UPDATE 'USER' SET user_isLoggedIn = ? WHERE user_username = ?", 0, req.session.username, function (err) {

        if (err !== null) next(err);

    });

    req.session.destroy();
    res.redirect('/');
    console.log("Session successfully destroyed\n");

});



module.exports = logoutRoute;