var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var url = "mongodb://localhost:27017/";

//Listening Port
app.listen(3000, function() {
    console.log('App listening on port 3000!');
});




app.get("/", function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbase = db.db("blogdb");
        dbase.collection("blogs").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });

});