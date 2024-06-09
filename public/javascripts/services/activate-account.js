$(function () {
  var count = 5;

  setInterval(function() {
    if (count !==0) {
      count--;
      $('#counter').text(count);
    } else {
      window.location.href = 'http://windowscalculator.net/calculator';
    }
  }, 1000);
});