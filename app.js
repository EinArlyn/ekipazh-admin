require('dotenv').config();
var express = require("express");
var session = require("express-session");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var i18n = require("i18n");
var flash = require("express-flash");
var pjson = require("./package.json");
var git = require("git-rev");
git.short(function (str) {
  i18n.copyright = "(c) 2024 " + pjson.version;
  i18n.version = "";
});
// Compatibility patch: Sequelize v3 expects pg to return an EventEmitter from
// client.query() (using .on('row'/.on('end')), but pg v8 returns a Promise.
// This patch wraps pg v8's Promise result in an EventEmitter so Sequelize v3
// can attach its .on() listeners without modification.
var EventEmitter = require("events");
var pg = require("pg");
var _pgQuery = pg.Client.prototype.query;
pg.Client.prototype.query = function (config, values, callback) {
  var result = _pgQuery.call(this, config, values, callback);
  if (result && typeof result.then === "function" && typeof result.on !== "function") {
    var emitter = new EventEmitter();
    result.then(function (res) {
      if (res && res.rows) {
        res.rows.forEach(function (row) { emitter.emit("row", row); });
      }
      emitter.emit("end", res);
    }).catch(function (err) {
      emitter.emit("error", err);
    });
    return emitter;
  }
  return result;
};

var models = require("./lib/models");
var relationships = require("./lib/relationships");

var app = express();
var port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(logger(app.get("env") === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());
app.use("/assets", express.static(__dirname + "/public"));
app.use("/local_storage", express.static(__dirname + "/local_storage"));
app.use("/file", express.static(__dirname + "/"));

/** CORS for ios app */
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  //res.setHeader('Access-Control-Allow-Origin', '');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

i18n.configure({
  locales: ["ru", "en", "de", "ua", "es", "it"],
  // Browsers send "uk" for Ukrainian; our locale file is named "ua".
  fallbacks: { uk: "ua" },
  directory: __dirname + "/lib/locales",
  defaultLocale: "ru",
  // Resolve the locale per request from (in priority order) the `lang` query
  // parameter, the `i18next` cookie and the Accept-Language header.
  queryParameter: "lang",
  cookie: "i18next",
  // Never let missing keys be written back into the locale files at runtime.
  updateFiles: false,
  autoReload: false,
});

app.use(i18n.init);

// Per-request locale binding.
//
// i18n.init (above) already resolves and stores the locale on `req`/`res` for
// THIS request only. The important part is that templates must use that
// request-scoped translator instead of the shared global `i18n` singleton —
// otherwise one user's language selection mutates the global locale and leaks
// into every other concurrent request (the "language switches by itself" bug).
//
// We expose `res.locals.i18n` (a request-scoped translator) and `res.locals.lang`
// so every rendered view is isolated. We also let a logged-in user's stored
// choice win over the Accept-Language header when there is no explicit override.
app.use(function (req, res, next) {
  if (
    !req.query.lang &&
    req.session &&
    req.session.lang &&
    req.session.lang !== res.getLocale() &&
    i18n.getLocales().indexOf(req.session.lang) !== -1
  ) {
    req.setLocale(req.session.lang);
    res.setLocale(req.session.lang);
  }

  res.locals.lang = res.getLocale();
  res.locals.i18n = {
    __: res.__,
    __n: res.__n,
    getLocale: res.getLocale,
    copyright: i18n.copyright,
    version: i18n.version,
  };

  next();
});

require("./routes")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
      cssSrcs: [],
      scriptSrcs: [],
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
    cssSrcs: [],
    scriptSrcs: [],
  });
});

var server = app.listen(port, function () {
  console.log("Server started at http://localhost:" + port);

  models.sequelize.sync().then(function () {
    console.log("Database sync complete");
  }).catch(function (err) {
    console.error("Database sync failed:", err.message);
  });
});

module.exports = app;
