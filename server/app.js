var express = require("express");
var path = require("path");
var passport = require("passport");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var Strategy = require("./lib").Strategy;
var uploadReport = require("./routes/uploadReport");
var queryReports = require("./routes/queryReports");
var getTestName = require("./routes/getTestName");
var githubLogin = require("./routes/githubLogin");

const deployPath = process.env.deployPath || "";
passport.use(new Strategy({
        clientID: "03502eb5c9d56dee6f61",
        clientSecret: "c75af2207e1d4d9bc953bf5d7d79c10d10eb0ed2",
        callbackURL: "http://localhost:3001/login/github/return"
    },
    function (accessToken, refreshToken, profile, cb) {
        profile.accessToken = accessToken;
        return cb(null, profile);
    }));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
app.use(deployPath, favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(cookieParser());
app.use(require("express-session")({ // manage github log in session
    secret: "my precious",
    resave: true,
    saveUninitialized: true
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//define static public path
app.use(deployPath, express.static(path.join(__dirname + "/../client/build")));
app.use(deployPath + "/report", express.static(path.join(__dirname + "/public/report")));

//use middlewares
app.use(deployPath, uploadReport);
app.use(deployPath, queryReports);
app.use(deployPath, getTestName);
app.use(deployPath, githubLogin);

app.get(deployPath, function (req, res) {
    res.sendFile(path.join(__dirname + "/../client/build", "index.html"));
});
app.get(deployPath + "/ReadReport", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "ReadReport.html"));
});
app.get(deployPath + "/UploadReport", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "UploadReport.html"));
});

// authenticate github
app.get(deployPath + "/login/github", passport.authenticate("github"));
app.get(deployPath + "/login/github/return", passport.authenticate("github", {
        failureRedirect: deployPath + "/"
    }),
    function (req, res) {
        res.redirect(deployPath + "/");
    });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;