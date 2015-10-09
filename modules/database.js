var sqlite3 = require("sqlite3").verbose();

var db;
var sqlRequest;

var database = {

    connect: function connect() {

        db = new sqlite3.Database('database.sqlite');

    } ,

    createUser: function (reqFormData) {

        sqlRequest= "INSERT INTO 'USER' (user_fName, user_lName, user_username, user_password, user_isAdmin, user_address, user_phone, user_email) " +
            "VALUES('"
            + reqFormData.firstName + "', '"
            + reqFormData.lastName + "', '"
            + reqFormData.username + "', '"
            + reqFormData.password + "', '"
            + reqFormData.isAdmin + "', '"
            + reqFormData.address + "', '"
            + reqFormData.phone + "', '"
            + reqFormData.email + "')";

        db.run(sqlRequest, function (err) {

            if (err !== null) next(err);

            else {

                console.log("Create User Query successfully ran.")

            }
        });

    }


};

module.exports = database;