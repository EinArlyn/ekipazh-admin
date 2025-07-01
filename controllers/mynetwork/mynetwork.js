var async = require('async');
var _ = require('lodash');
var i18n = require('i18n');
var conf = require('../../config.json');

var getIncludedUsers = require('../../lib/services/helpers').getIncludedUsers;
var models = require('../../lib/models');

/**
 * Get my network users
 * @param {timestamp}  dateFrom
 * @param {timestamp}  dateTo
 */
module.exports = function (req, res) {
  var lang = req.getLocale();

  if (conf.production && conf.production.specLink.indexOf('ekipazh') > -1) {
    return res.redirect('/');
  }

  /** Set time interval of entries, orders, calcs */
  var from = (req.query.from ? (req.query.from.split('.')[2] + '-' + req.query.from.split('.')[1] + '-' + req.query.from.split('.')[0]) : new Date(req.session.user.created_at).getFullYear() + '-' + (("0" + (new Date(req.session.user.created_at).getMonth() + 1)).slice(-2)) + '-' + ("0" + new Date(req.session.user.created_at).getDate()).slice(-2));
  var to = (req.query.to ? (req.query.to.split('.')[2] + '-' + req.query.to.split('.')[1] + '-' + req.query.to.split('.')[0]) : new Date().getFullYear() + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + ("0" + new Date().getDate()).slice(-2));
  var lights = (req.query.lights ? req.query.lights : '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14');

  async.waterfall([
    function (_callback) {
      var lighters = getLightersCount(req.session.user.id);
      var lightersArray = [];

      function getLightersCount (userId) {
        return models.sequelize.query('SELECT users.id, users.parent_id, users.identificator ' +
          'FROM users ' +
          'WHERE users.parent_id = ' + userId +
        '').then(function(includedUsers) {
          if (includedUsers[0]) {
            lightersArray.push(_.pluck(includedUsers[0], 'identificator'));
            for (var i = 0; i < includedUsers[0].length; i++) {
              includedUsers[0][i].includedUsers = getLightersCount(includedUsers[0][i].id);
            }
            return includedUsers[0];
          } else {
            return;
          }
        });
      }

      setTimeout(function() {
        _callback(null, lightersArray);
      }, 1200);
    },
    function (lightersArray, _callback) {
      models.user_identificators.find({
        where: {
          factory_id: req.session.user.factory_id
        }
      }).then(function (factoryIdentificators) {
        res.render('mynetwork/index.jade', {
          i18n: i18n,
          title: i18n.__('My network'),
          thisPageLink  : '/mynetwork/',
          from: from,
          to: to,
          lights: lights.split(',').map(function(i) { return parseInt(i, 10); }),
          user: req.session.user,
          userName: req.session.user.name,
          lang: lang,
          lightersArray: _.countBy(_.compact(_.flatten(lightersArray)), _.identity),
          factoryIdentificators: factoryIdentificators,
          cssSrcs: ['/assets/stylesheets/mynetwork.css'],
          scriptSrcs: ['/assets/javascripts/vendor/popover/jquery.webui-popover.min.js', '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/mynetwork.js']
        });
        _callback(null);
      }).catch(function (error) {
        _callback(error);
        console.log(error);
        res.send('Internal server error.');
      });
    }
  ], function (err, results) {
    if (err) {
      console.log(err);
      console.log(results);
    }
  });
}
