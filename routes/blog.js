var express = require('express');
const bodyParser = require("body-parser");
var router = express.Router();
var db;
const app = express();

//Import Mongo Client and ObjectId 
const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";

//Establish Connection to URL 
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database.db("blogdb");
    console.log("DataBase Connected");
    //Listening Port
    app.listen(3000, function() {
        console.log('App listening on port 3000!');
    });

});



var jsonParser = bodyParser.json();
var ObjectId = require("mongodb").ObjectId;
router.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.send("Hello World");
});

// Retrieve all posts
router.get('/', function(req, res) {
    db.collection('blogs').find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get notes.");
        } else {
            console.log(docs);
            res.status(200).json(docs);
        }
    });
});

// Retrieve single post
router.get("/:id", function(req, res) {
    db.collection('blogs').findOne({
        _id: ObjectId(req.params.id)
    }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get post");
        } else {
            res.status(200).json(doc);
        }
    });
});

//insert
router.post("/", jsonParser, function(req, res) {
    var newPost = req.body;
    console.log(newPost);
    newPost.createDate = new Date();

    db.collection('blogs').insertOne(newPost, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new post.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

//edit
router.put("/:id", jsonParser, function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection('blogs').updateOne({
        _id: ObjectId(req.params.id)
    }, updateDoc, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update post");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
});

//delete
router.delete("/:id", function(req, res) {
    db.collection("blogs").deleteOne({
            _id: ObjectId(req.params.id)
        },
        function(err, result) {
            if (err) {
                handleError(res, err.message, "Failed to delete post");
            } else {
                res.status(200).json(req.params.id);
            }
        }
    );
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
        "error": message
    });
}


module.exports = router;