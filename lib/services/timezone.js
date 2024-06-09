'use strict';

var UAoffset = 3;

module.exports = function (date) {
  var currentDate = new Date(date);

  var utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
  var UATime = new Date(utc + (3600000 * UAoffset));
  return UATime;
};
