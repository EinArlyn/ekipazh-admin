var formidable = require('formidable');

exports.parseForm = function (req, cb) {
  var form = new formidable.IncomingForm({
    keepExtensions: true,
    allowEmptyFiles: true,
    minFileSize: 0
  });
  form.parse(req, function (err, fields, files) {
    if (!err) {
      Object.keys(fields).forEach(function (key) {
        if (Array.isArray(fields[key]) && fields[key].length === 1) {
          fields[key] = fields[key][0];
        }
      });
      Object.keys(files).forEach(function (key) {
        if (Array.isArray(files[key]) && files[key].length === 1) {
          files[key] = files[key][0];
        }
        var file = files[key];
        if (file && file.filepath !== undefined) {
          file.path = file.filepath;
          file.name = file.originalFilename;
        }
      });
    }
    cb(err, fields, files);
  });
};
