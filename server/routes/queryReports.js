const express = require("express");
const moment = require("moment");
const router = express.Router();

router.get("/queryReports", function(req, res) { // new query with MongoDB
    if (!queryValidator(req.query)) {
        res.status(400).send("Missing query parameter!");
    } else {
        var db = req.app.get("dbConnection").db("qareport");
        // Get the documents collection
        var collection = db.collection("reportResult");
        var queryObj = {
            $or: []
        };
        if (req.query.reportEnvir1 === "true") {
            queryObj.$or.push({
                envirTested: "Envir1"
            });
        }
        if (req.query.reportEnvir2 === "true") {
            queryObj.$or.push({
                envirTested: "Envir2"
            });
        }
        if (req.query.reportEnvir3 === "true") {
            queryObj.$or.push({
                envirTested: "Envir3"
            });
        }
        if (req.query.reportCategory != null) {
            var tempCate = req.query.reportCategory.split(",");
            for (let i = 0; i < tempCate.length; i++) {
                tempCate[i] = parseInt(tempCate[i]);
            }
            queryObj.testID = {
                $in: tempCate
            };
        }
        if (req.query.requestType === "Date") {
            if (req.query.reportDate !== "") {
                queryObj.testDate = {
                    $eq: convertToUTC(req.query.reportDate)
                };
            } else {
                res.status(400).send("Bad Request, no date input.");
            }
        } else {
            if (req.query.startDate === "null") {
                queryObj.testDate = {
                    $gte: convertToUTC("01/01/2017"),
                    $lte: convertToUTC(req.query.endDate)
                };
            } else {
                queryObj.testDate = {
                    $gte: convertToUTC(req.query.startDate),
                    $lte: convertToUTC(req.query.endDate)
                };
            }
        }
        let result = [
            [],
            [],
            []
        ]
        collection.find(queryObj).project({
            _id: 0
        }).toArray(function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500).send("Database query failed!");
            } else {
                let cateCol = db.collection("reportCategory");
                getIDRef(cateCol, function(err, idRef) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Database query failed!");
                    } else {
                        docs.forEach(function(element) {
                            element.testName = idRef[element.testID];
                            if (element.envirTested == "Envir1") {
                                result[0].push(element);
                            } else if (element.envirTested == "Envir2") {
                                result[1].push(element);
                            } else {
                                result[2].push(element);
                            }
                        }, this);
                        for (let i = 0; i < result.length; i++) {
                            result[i].sort(function(a, b) {
                                if (req.query.sort === "Date") {
                                    if (a.testDate < b.testDate) {
                                        return -1;
                                    } else if (a.testDate > b.testDate) {
                                        return 1;
                                    } else {
                                        if (a.testName < b.testName) {
                                            return -1;
                                        } else if (a.testName > b.testName) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                } else {
                                    if (a.testName < b.testName) {
                                        return -1;
                                    } else if (a.testName > b.testName) {
                                        return 1;
                                    } else {
                                        if (a.testDate < b.testDate) {
                                            return -1;
                                        } else if (a.testDate > b.testDate) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                }
                            });
                        }
                        res.send(result);
                    }
                });
            }
        });
    }
});

router.get("/getLatestReports", function(req, res) {
    var db = req.app.get("dbConnection").db("qareport");
    // Get the documents collection
    var collection = db.collection("reportResult");
    var queryObj = {
        envirTested: req.query.envir || null,
        testDate: convertToUTC(req.query.testDate)
    };
    collection.find(queryObj).project({}).toArray(function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500).send("Database query failed!");
        } else {
            var cateCol = db.collection("reportCategory");
            getIDRef(cateCol, function(err, idRef) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Database query failed!");
                } else {
                    docs.forEach(function(element) {
                        element.testName = idRef[element.testID];
                    }, this);
                    docs.sort(function(a, b) {
                        if (a.testName < b.testName) {
                            return -1;
                        } else if (a.testName > b.testName) {
                            return 1;
                        } else {
                            if (a.fileName < b.fileName) {
                                return -1;
                            } else if (a.fileName > b.fileName) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                    res.send(docs);
                }
            });
        }
    });
});

router.get("/getIDRef", function(req, res) {
    var db = req.app.get("dbConnection").db("qareport");
    // Get the documents collection
    var collection = db.collection("reportCategory");
    getIDRef(collection, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database query failed!");
        } else {
            res.send(result);
        }
    });
})

function getIDRef(dbCol, cb) {
    dbCol.find().toArray(function(err, docs) {
        if (err) {
            cb(err, returnObj);
        } else {
            var returnObj = {};
            docs.forEach(function(element) {
                var tempObj = [element];
                var arr = [0];
                if (element.child != null) {
                    while (tempObj.length > 0) {
                        if (arr[arr.length - 1] <= tempObj[tempObj.length - 1].child.length - 1) {
                            if (tempObj[tempObj.length - 1].child[arr[arr.length - 1]].child != null) {
                                tempObj.push(tempObj[tempObj.length - 1].child[arr[arr.length - 1]]);
                                arr.push(0);
                            } else {
                                returnObj[tempObj[tempObj.length - 1].child[arr[arr.length - 1]].id] = tempObj[tempObj.length - 1].child[arr[arr.length - 1]].testName;
                                arr[arr.length - 1]++;
                            }
                        } else {
                            arr.pop();
                            tempObj.pop();
                            arr[arr.length - 1]++;
                        }
                    }
                }
            }, this);
            cb(err, returnObj);
        }
    });
}

function queryValidator(testObj) {
    var paramsList = ["reportEnvir1", "reportEnvir2", "reportEnvir3"];
    for (var i = 0; i < paramsList.length; i++) {
        if (testObj.hasOwnProperty(paramsList[i]) && testObj[paramsList[i]] === "true") {
            return true;
        }
    }
    return false;
}

function convertToUTC(dateStr) {
    var temp = moment(dateStr, ["YYYY-MM-DD", "MM/DD/YYYY"]).toDate();
    temp = new Date(temp.getTime() - temp.getTimezoneOffset() * 60000);
    return temp;
}

module.exports = router;