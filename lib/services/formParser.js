var formidable = require('formidable');

exports.parseForm = function (req, cb) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, cb);
};
