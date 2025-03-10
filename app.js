var express = require("express");
var session = require("express-session");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var i18n = require("i18n");
var flash = require("express-flash");
var pjson = require("./package.json");
var git = require("git-rev");
git.short(function (str) {
  i18n.copyright = "(c) 2024 " + pjson.version;
  i18n.version = "";
});
var models = require("./lib/models");
var relationships = require("./lib/relationships");

var app = express();
var port = process.env.PORT || 5002;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "dgdfg389t77efghjkfvk", saveUninitialized: true }));
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
  directory: __dirname + "/lib/locales",
  defaultLocale: "ru",
});

app.use(i18n.init);

const supportedLocales = ["ru", "en", "de", "uk", "es", "it"];
const localeMapping = {
  uk: "ua", // добавим маппинг для преобразования языка
};

function determineLanguage(req) {
  const acceptLanguage = req.headers["accept-language"];

  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim());

    const language = languages.find((lang) => supportedLocales.includes(lang));

    if (language) {
      return localeMapping[language] || language;
    }
  }

  return null;
}

app.use(function (req, res, next) {
  if (req.url === "/login") {
    const language = determineLanguage(req);
    if (language) {
      i18n.setLocale(language);
      res.cookie('i18next', language, { maxAge: 900000, httpOnly: false, path: '/' });
    } else {
      i18n.setLocale('en');
      res.cookie('i18next', 'en', { maxAge: 900000, httpOnly: false, path: '/' });
    }
  }

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

models.sequelize.sync().then(function () {
  var server = app.listen(port, function () {
    console.log("Server started at http://localhost:" + port);
  });
});

module.exports = app;
