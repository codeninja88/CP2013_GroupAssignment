var sqlite3 = require("sqlite3").verbose();

var db;

var database = {

    connect: function connect() {

        db = new sqlite3.Database('database.sqlite');

    } ,


    insert: function (tableName, data) {

        var dataKeys = Object.keys(data);
        var sql = "INSERT into '" + tableName + "' (";
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

        var sql = "SELECT * FROM '" + tableName + "';";
        var results = [];

        function handleRow(error, row) {

            results.push(row);

        }

        function handleCompletion() {

            callback(results);
        }

        db.each(sql, handleRow, handleCompletion);
    },



    remove: function(tableName, attributeObj) {

        var sql = "DELETE FROM '" + tableName + "' WHERE ";

        Object.keys(attributeObj).forEach(

            function (currKey) {

                sql += currKey + " = '" + attributeObj[currKey] + "';";

            }
        );

        db.run(sql, function (err) { if (err !== null) next(err); });

    }



};

module.exports = database;