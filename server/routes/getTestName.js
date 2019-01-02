const express = require("express");
const router = express.Router();

router.get("/getTestName", function (req, res) {
    var db = req.app.get("dbConnection");
    // Get the documents collection
    var collection = db.collection("reportCategory");
    // if don't want "_id" attribute: project({ _id: 0, 'child._id': 0, 'child.child._id': 0})
    collection.find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
            res.status(500).send("Database Query failed!");
        } else {
            res.send(docs);
        }
    });
});

module.exports = router;