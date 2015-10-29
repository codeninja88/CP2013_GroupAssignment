//-----------------------------------------------------------------//
//-------> MODULE DECLARATIONS & INITIALISATIONS <-----------------//
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database.sqlite');

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var session = require('express-session');
var bodyParser = require('body-parser');


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


app.use('/', homeRouter,
             loginRouter
);

app.use('/admin', adminRouter);
app.use('/doorGates', doorGatesRouter);
app.use('/garden', gardenRouter);
app.use('/holidayMode', holidayModeRouter);
app.use('/light', lightsRouter);
app.use('/logout', logoutRouter);


//socket.io used here for index page real-time data
io.on('connection', function (socket) {


    setInterval(checkData, 1000);

    function checkData() {
        sqlRequest = "SELECT * FROM 'PREFERENCE' WHERE pref_isActive = 1";
        var prefStatusData = [];
        db.serialize(function () {
            db.each(sqlRequest, function (err, row) {
                prefStatusData.push({
                    prefName: row.pref_name,
                    isActive: row.pref_isActive
                });

            }, function () {
                socket.emit('connection', prefStatusData);
            });
        });
    }

});




var raining = false;        // this variable start and stop garden sprinklers
var wetGround = false;      // checks how long raining for and based on that start and stop spinklers
var rainingTime = 0;        // keeps track on how long its been raining for
var lightsActiveMotion = false;   // checks if light has been triggered from motion


setInterval(getRandomNumber, 5000); // time to refresh random numbers

function getRandomNumber() {
    var lightsVar = [];                 // stores the light name with random number for motion
    var sqlLightSensorTriggered;

    db.serialize(function() {
        var sqlRequestLights = "SELECT * FROM 'PREFERENCE' WHERE pref_name LIKE 'light%'";

        db.each(sqlRequestLights, function(err, row) {

            var randomLightMotion = Math.floor(Math.random() * (10) + 1);
            lightsVar.push({
                lightName: row.pref_name,
                lightMotion: randomLightMotion
            });

        }, function (){
            // runs as many times as the entries in lightsData and checks the random number value
            for (var x = 0; x < lightsVar.length; x++) {
                if (lightsVar[x].lightMotion <= 3) {
                    lightsActiveMotion = true;
                    sqlLightSensorTriggered = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 1 WHERE pref_name = '"+lightsVar[x].lightName+"'";
                } else {
                    lightsActiveMotion = false;
                    sqlLightSensorTriggered = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 0 WHERE pref_name = '"+lightsVar[x].lightName+"'";
                }
                //console.log(lightsVar[x].lightName + " is triggered: " + lightsActiveMotion);

                db.serialize(function(next) {
                    db.run(sqlLightSensorTriggered, function (err) {
                        if (err !== null) next(err);
                    });
                })
            }
            //console.log(lightsVar);
        });
    });

    var weatherNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

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

}


// timer checking if lights etc On/Off status changed
setInterval(function () {

    var sqlRequest = "SELECT * FROM 'PREFERENCE'";
    var allData = [];
    var time24 = convertTo24Hour();


    db.serialize(function (next) {
        //console.log("lightName in timer loop: " + JSON.stringify(lightsVar));

        db.each(sqlRequest, function (err, row) {

            allData.push({
                pref_name: row.pref_name,
                startTime: row.pref_startTime,
                stopTime: row.pref_stopTime,
                sensorActivated: row.sensorActivated
            })



        }, function () {


            allData.forEach(function (data) {


                var sqlRequest;

                var startTime = data.startTime.toString().trim();
                var stopTime = data.stopTime.toString().trim();
                var systemTime = time24.toString().trim();
                var pref_name = data.pref_name.toString().trim();
                var sensorActivated = data.pref_name.toString().trim();



                var timeMode = 0; // normal

                if (stopTime < startTime) {
                    timeMode = 1;
                    //time period crosses midnight
                } else {
                    timeMode = 0;
                    //time period does not cross midnight

                }



                    if (timeMode === 0) {

                        //GARDEN TIME

                        // checking if timer is set between given time and not raining and ground is not wet THEN device/pref is active and sensor is off, motion is off
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

                        //LIGHT STUFF

                        if ((systemTime >= startTime && systemTime < stopTime)) {
                            //IS ACTIVE WITHOUT MOTION SENSOR

                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 0 WHERE pref_name = '" + pref_name + "';";

                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);

                            });
                        } else if ((systemTime >= startTime && systemTime < stopTime) && (sensorActivated) && (pref_name.startsWith('light'))) {
                            //IS ACTIVE WITH MOTION SENSOR
                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 1 WHERE pref_name = '" + pref_name + "';";

                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);

                            });
                        }


                        if ((systemTime < startTime || systemTime >= stopTime) && (sensorActivated) && (pref_name.startsWith('light'))) {
                            //ACTIVE

                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 1 WHERE pref_name = '" + pref_name + "';";

                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);

                            });

                        }



                    } else if (timeMode === 1) {

                        //GARDEN TIME

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

                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0, pref_sensorTriggered = 0 WHERE pref_name = '" + pref_name + "';";


                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);


                            });
                        }

                        //LIGHT STUFF

                        if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime))) {
                            //IS ACTIVE

                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 0  WHERE pref_name = '" + pref_name + "';";

                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);

                            });

                        } else if (((systemTime >= startTime && systemTime < '24:00') || (systemTime < stopTime)) && (sensorActivated) && (pref_name.startsWith('light')))  {

                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 0 WHERE pref_name = '" + pref_name + "';";

                            db.run(sqlRequest, function (err) {

                                if (err !== null) next(err);

                            });
                        }

                        if ((systemTime >= stopTime && systemTime < startTime) && (sensorActivated) && (pref_name.startsWith('light'))) {

                            sqlRequest = "UPDATE 'PREFERENCE' SET pref_isActive = 1, pref_sensorTriggered = 1 WHERE pref_name = '" + pref_name + "';";

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


http.listen(process.env.PORT || 3000, function() {

    console.log("running at --> http://localhost:3000/");

});

