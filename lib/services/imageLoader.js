var fs = require('fs');

exports.loadImage = loadImage;
exports.loadImageBase = loadImageBase;

function loadImage (from, to) {
  fs.readFile(from, function(err, data) {
    if (err) {
      console.log('Image upload error. Error: ' + err);
    }
    fs.writeFile('.' + to, data, function(err) {});
  });
}

function loadImageBase (binary, to) {
  var base64Data = binary.replace(/^data:image\/png;base64,/, "");

  fs.writeFile('.' + to, base64Data, 'base64', function(err) {
    console.log(err);
  });
}
