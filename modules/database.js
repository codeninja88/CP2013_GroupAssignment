var sqlite3 = require("sqlite3").verbose();

var db;
var sql;

var database = {

    connect: function connect() {

        db = new sqlite3.Database('database.sqlite');

    } ,


    insert: function (tableName, data) {

        var dataKeys = Object.keys(data);
        sql = "INSERT into '" + tableName + "' (";
        var valueStr = ") VALUES (";

        for (var i = 0; i < dataKeys.length; i++) {

            var currKey = dataKeys[i];

            if (i !== 0) {
                sql += ", ";
                valueStr += ", ";
            }

            sql += currKey;
            valueStr += "'" + data[currKey] + "'";

        }

        sql += valueStr + ")";

        db.run(sql, function (err) {

            if (err !== null) next(err);

            else {

                console.log("Insert Successful")

            }
        });


    },

    selectAll: function (tableName, callback) {

        sql = "SELECT * FROM '" + tableName + "';";
        var results = [];

        function handleRow(error, row) {

            results.push(row);

        }

        function handleCompletion() {
            // all results collected, so use callback
            // to signal data is ready....
            callback(results);
        }

        db.each(sql, handleRow, handleCompletion);
    }



};

module.exports = database;