//-----------------------------------------------------------------//
//-------> MODULE DECLARATIONS & INITIALISATIONS <-----------------//
var sqlite3 = require("sqlite3").verbose();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var db = new sqlite3.Database('database.sqlite');
var app = express();


// SEPARATE ROUTES
var homeRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var lightsRouter = require('./routes/lights');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var gardenRouter = require('./routes/garden');
var holidayModeRouter = require('./routes/holidayMode');
var doorGatesRouter = require('./routes/doorGates');


app.use(express.static(__dirname));


// SESSION SETUP
app.use(session(
    {
        secret: 'agileisawesome',
        saveUninitialized: true,
        resave: true
    }
));


app.set('view engine', 'ejs');
app.locals.pretty = true; // makes sure code is readable in JS console

app.use(express.static("public"));

app.use(bodyParser.urlencoded( {extended: true} ));


app.use('/', homeRouter);
app.use('/', adminRouter);
app.use('/', lightsRouter);
app.use('/', loginRouter);
app.use('/', logoutRouter);
app.use('/', gardenRouter);
app.use('/', holidayModeRouter);
app.use('/', doorGatesRouter);

var weatherNumber = 1;
setInterval(getRandomNumber, 30000); // time to refresh weatherNumber

function getRandomNumber() {
    weatherNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    console.log(weatherNumber);
}

// timer checking if lights etc On/Off status changed
setInterval(function () {

    var sqlRequest = "SELECT * FROM 'PREFERENCE'";
    var allData = [];
    var time24 = convertTo24Hour();

    db.serialize(function (next) {

        db.each(sqlRequest, function (err, row) {

            allData.push({
                pref_name: row.pref_name,
                startTime: row.pref_startTime,
                stopTime: row.pref_stopTime
            })


        }, function () {

            allData.forEach(function (data) {


                var sqlRequest;

                var startTime = data.startTime.toString().trim();
                var stopTime = data.stopTime.toString().trim();
                var systemTime = time24.toString().trim();
                var pref_name = data.pref_name.toString().trim();


                var timeMode = 0; // normal

                if (stopTime < startTime) {
                    timeMode = 1;
                    //time period crosses midnight
                } else {
                    timeMode = 0;
                    //time period does not cross midnight

                }



                if (timeMode === 0) {

                    if ((systemTime >= startTime && systemTime < stopTime) && (weatherNumber <= 6)) {
                        //IS ACTIVE

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });
                    } else if ((systemTime >= startTime && systemTime < stopTime) && (weatherNumber >= 7 && weatherNumber <= 10)) {

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name LIKE 'g%';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });
                    }
                    if ((systemTime < startTime || systemTime >= stopTime) && (weatherNumber <= 6)) {
                        // NOT ACTIVE

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });
                    } else if ((systemTime < startTime || systemTime >= stopTime) && (weatherNumber >= 7 && weatherNumber <= 10)) {
                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name LIKE 'g%';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);


                        });
                    }


                } else if (timeMode === 1) {

                    console.log("SYSTEM TIME: " + systemTime);
                    if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime)) && (weatherNumber <= 6)) {
                        //IS ACTIVE

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });
                    } else if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime)) && (weatherNumber >= 7 && weatherNumber <= 10)) {
                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name LIKE 'g%';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);


                        });
                    }

                    if ((systemTime >= stopTime && systemTime < startTime) && (weatherNumber <= 6)) {
                        // NOT ACTIVE

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);


                        });
                    } else if ((systemTime >= stopTime && systemTime < startTime) && (weatherNumber >= 7 && weatherNumber <= 10)) {
                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name LIKE 'g%';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);


                        });
                    }


                }






            });

        })

    });


// CONVERTING SYSTEM TIME FORMAT TO CHECK WITH SQL DATE DATA
    function convertTo24Hour() {

        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        var ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;


        var time = hours + ':' + minutes + ' ' + ampm;

        var hoursAgain = parseInt(time.substr(0, 2));

        if (time.indexOf('am') != -1 && hoursAgain == 12) time = time.replace('12', '0');

        if (time.indexOf('pm') != -1 && hours < 12) time = time.replace(hoursAgain, (hoursAgain + 12));

        return time.replace(/(am|pm)/, '');

    }



}, 1000);


app.listen(process.env.PORT || 3000, function() {

    console.log("running at --> http://localhost:3000/");

});

