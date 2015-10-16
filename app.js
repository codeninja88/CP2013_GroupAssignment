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


app.use('/',
    homeRouter,
    adminRouter,
    lightsRouter,
    loginRouter,
    logoutRouter,
    gardenRouter,
    holidayModeRouter,
    doorGatesRouter
);



var raining = false;        // this variable start and stop garden sprinklers
var wetGround = false;      // checks how long raining for and based on that start and stop spinklers
var rainingTime = 0;        // keeps track on how long its been raining for


var motionLightNumber = 1;
setInterval(getRandomNumber, 3000); // time to refresh raining

function getRandomNumber() {
    var weatherNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    motionLightNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    //console.log("Motion:" + motionLightNumber);


    var sqlRequest = "UPDATE 'TIMER' SET timer_time ='"+ weatherNumber +"' WHERE timer_name = 'timer_weather'";
    var sqlRequest2 = "UPDATE 'TIMER' SET timer_time ='"+ motionLightNumber +"' WHERE timer_name = 'timer_light'";

    if (weatherNumber > 6) {
        raining = true;

        if(rainingTime <= 6) rainingTime++;

    } else {
        raining = false;

        if(rainingTime > 0) rainingTime--;
    }

    if (rainingTime > 2){
        wetGround = true;
    } else {
        wetGround = false;
    }


    console.log('Raining Time:  ' +rainingTime);
    console.log('Ground is wet: '  + wetGround);
    console.log('Its raining: ' + raining);


    db.serialize(function(next) {
        db.run(sqlRequest, function (err, row) {
            if (err !== null) next(err);
        });
        db.run(sqlRequest2, function (err) {
            if (err !== null) next(err);
        });
    })
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

                    // checking if timer is set between given time and not raining and ground is not wet THEN device/pref is active and sensor is off
                    if ((systemTime >= startTime && systemTime < stopTime) && (raining === false) && (wetGround === false)) {
                        //IS ACTIVE


                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 0 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });


                    }

                    // checking if timer is set between given time and its raining THEN device/pref is de-active and sensor is On
                    else if ((systemTime >= startTime && systemTime < stopTime) && (raining === true)) {

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 1 WHERE pref_name LIKE 'g%';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });
                    }

                    // checking if timer is set between given time and its not but ground is wet THEN device/pref is de-active and sensor is On
                    else if ((systemTime >= startTime && systemTime < stopTime) && (raining === false) && (wetGround === true)) {


                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 1 WHERE pref_name LIKE 'g%';";


                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });

                    }


                    // Checking if time is outside given time and not raining THEN de-activate device/pref
                    if ((systemTime < startTime || systemTime >= stopTime)) {
                        // NOT ACTIVE

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 0 WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });

                    }







                } else if (timeMode === 1) {

                    //console.log("SYSTEM TIME: " + systemTime);


                    // checking if timer is set between given time and its not raining THEN device/pref active and sensor is On
                    if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime)) && (raining === false) && (wetGround === false)) {
                        //IS ACTIVE


                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 0  WHERE pref_name = '" + pref_name + "';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);

                        });


                    }

                    // checking if timer is set between given time and its raining THEN device/pref is de-active and sensor is On
                    else if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime)) && (raining === true)) {

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name LIKE 'g%';";

                        db.run(sqlRequest, function (err) {

                            if (err !== null) next(err);


                        });
                    }

                    // checking if timer is set between given time and its not but ground is wet THEN device/pref is de-active and sensor is On
                    else if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime)) && (raining === false) && (wetGround === true)) {

                        try {
                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 1 WHERE pref_name LIKE 'g%';";

                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);

                            });

                        } catch (err) {

                            console.log('Error where next was');

                        }



                    }

                    // Checking if time is outside given time THEN de-activate device/pref
                    if ((systemTime >= stopTime && systemTime < startTime)) {
                        // NOT ACTIVE

                        sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 1 WHERE pref_name = '" + pref_name + "';";


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

