const express = require("express");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const router = express.Router();

// router.get("/getGitToken", function (req, res) {
//     var xhr = new XMLHttpRequest();
//     var request = {};
//     request.code = req.query.code;
//     request.client_id = "id";
//     request.client_secret = "secret";
//     xhr.open("POST", "urlaccesstoken");
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.send(JSON.stringify(request));
//     xhr.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             res.send(this.responseText);
//         }
//     };
// });

router.get("/getGitToken", function (req, res) {
    if (req.user) {
        res.send(req.user.accessToken);
    } else {
        res.send(null);
    }
});

router.get("/getGitUser", function (req, res) {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send(null);
    }
});

module.exports = router;