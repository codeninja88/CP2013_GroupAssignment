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

        db.run(sql, function (err) { if (err !== null) next(err); });


    },



    selectAll: function (tableName, likeObj, callback) {


        var sql = "SELECT * FROM '" + tableName + "'";

        if (likeObj.likeType === 'startsWith') {

            sql += " WHERE " + likeObj.likeKey + " LIKE '" + likeObj.likeValue + "%';";

        } else {

            sql += ";";

        }

        console.log(sql);

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

        var counter = 0;

        Object.keys(attributeObj).forEach(

            function (currKey) {

                if (counter > 0) sql += ", ";

                sql += currKey + " = '" + attributeObj[currKey] + "'";

                counter++;

            }
        );

        sql += ";";

        db.run(sql, function (err) { if (err !== null) next(err); });

    },



    update: function(tableName, attributeObj, whereObj) {

        var sql = "UPDATE '" + tableName + "' SET ";

        var counter = 0;

        Object.keys(attributeObj).forEach(

            function (currKey) {

                if (counter > 0) sql += ", ";

                sql += currKey + " = '" + attributeObj[currKey] + "'";

                counter++;

            }
        );

        sql += " WHERE ";

        counter = 0;

        Object.keys(whereObj).forEach(
            function (currKey) {

                if (counter > 0) sql += " AND ";

                sql += currKey + " = '" + whereObj[currKey] + "'";

                counter++;

            }
        );

        sql += ";";

        db.run(sql, function (err) { if (err !== null) next(err);});

    }



};

module.exports = database;