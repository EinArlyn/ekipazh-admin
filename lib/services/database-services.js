var fs = require('fs');

exports.importDatabase = importDatabase;

function importDatabase(path) {
  fs.readFile(path, function(err, data) {
    if (err) {
      console.log('File read error. Error: ' + err);
    }
    var factoryData = JSON.parse(data);
  });
}