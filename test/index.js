var expect = require('expect.js');
var home = require('../controllers/dashboard');
var mailer = require('../lib/services/mailer');

var accountNo;

describe('home', function() {
  /*it('generate analitycs login url', function(done) {
    this.timeout(15000);
    home.index();
    done();
  });
*/
  it('test email', function(done) {
    mailer.sendMail({
     text:    "i hope this works",
     from:    "Steko <calculator@steko.com.ua>",
     to:      "dmitry.panasenko@gmail.com",
     subject: "testing emailjs"
  }, function(err, message) {
    console.log(err || message);
    done(); });
  });
});
