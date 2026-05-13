var fs = require('fs');

exports.loadImage = loadImage;
exports.loadImageBase = loadImageBase;

// function loadImage (from, to) {
//   fs.readFile(from, function(err, data) {
//     if (err) {
//       console.log('Image upload error. Error: ' + err);
//     }
//     fs.writeFile('.' + to, data, function(err) {});
//   });
// }

function loadImage(from, to) {
  fs.readFile(from, function(err, data) {
    if (err) {
      console.error('Image read error: ' + err);
      return;
    }
    console.log('Writing to:', require('path').resolve('.' + to));
    fs.writeFile('.' + to, data, function(err) {
      if (err) {
        console.error('Image write error: ' + err);
      } else {
        console.log('Image saved to: ' + '.' + to);
      }
    });
  });
}

function loadImageBase (binary, to) {
  var base64Data = binary.replace(/^data:image\/png;base64,/, "");

  fs.writeFile('.' + to, base64Data, 'base64', function(err) {
    console.log(err);
  });
}
