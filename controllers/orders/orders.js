var i18n = require('i18n');
var models = require('../../lib/models');
var config = require('../../config.json');

var env = process.env.NODE_ENV || 'development';
var ORDER_BY = 'created';
var ITEMS_PER_PAGE = 7;

/**
 * Get orders history
 * @param {integer} page - Page of current orders list
 *        [default] 0
 * @param {string || 0} state - State of orders
 * @param {string || 0} orderBy - не помню, лол (:
 * @param {date} date_from - Orders from current date
 *        [default] The first order for current user|factory
 * @param {date} - date_to Orders to current date
 *        [default] Present date
 */
module.exports = function (req, res) {
  var lang = req.getLocale();
  var rights = (req.session.user.user_type !== 7 && req.session.user.is_all_calcs ? true : false);

  models.order_prices.min('modified', {
    where: getTimeWhereTemplate(rights, req.session.user.factory_id, req.session.user.id)
  }).then(function (olderOrder) {
    var orderBy, from, to, where, include;
    if (req.query.date_from) {
      from = new Date(Date.parse(req.query.date_from.split('.').reverse().join('-')));
      to = new Date(Date.parse(req.query.date_to.split('.').reverse().join('-')));
    } else {
      from = olderOrder || new Date();
      to = new Date();
    }
    from.setHours(0,0,0,0);
    to.setHours(23,59,59,999);

    var page = parseInt(req.params.page, 10) || 0;
    var offset = page * ITEMS_PER_PAGE;
    where = getOrderWhereTemplate(rights, req.session.user.factory_id, req.session.user.id, from, to);
    include = getOrderIncludeTemplate(rights, req.session.user.factory_id, req.session.user.id);

    if (req.query.state && req.query.state !== '0') {
      if (!rights) include[0].where[req.query.state] = { $ne: new Date(0) };
      orderBy = req.query.state;
    } else if (req.query.order && req.query.order !== '0') {
      if (!rights) include[0].where[req.query.order] = { $ne: new Date(0) };
      orderBy = req.query.order;
    } else {
      orderBy = '0';
    }

    models.order_prices.findAndCountAll({
      where: where,
      limit: ITEMS_PER_PAGE,
      offset: offset,
      order: [["modified","DESC"]],
      include: include
    }).then(function (result) {
      var currentPage = parseInt(req.params.page, 10) || 0;
      var totalPages = Math.ceil(result.count / ITEMS_PER_PAGE);

      var fromC = {
        date: ("0" + from.getDate()).slice(-2),
        month: ("0" + (from.getMonth() + 1)).slice(-2),
        year: from.getFullYear()
      };

      var toC = {
        date: ("0" + to.getDate()).slice(-2),
        month: ("0" + (to.getMonth() + 1)).slice(-2),
        year: to.getFullYear()
      };

      models.order_prices.count({
        where: { user_id: req.session.user.id }
      }).then(function (totalOrdersCount) {
        models.users.find({
          where: {
            id: req.session.user.id
          }
        }).then(function (currUser) {

          result.rows.forEach(row => {
            if (row.user.currencies_id === 684) {
              row.user.currency_icon = ' €';
            } else if (row.user.currencies_id === 685) {
              row.user.currency_icon = ' $';
            } else {
              row.user.currency_icon = ' ₴';
            }
          }) 
          
          res.render('orders', {
            i18n          : i18n,
            title         : i18n.__('Orders history'),
            olderOrder    : olderOrder,
            orders        : result.rows,
            totalPages    : totalPages,
            totalCount    : totalOrdersCount,
            EXPORT_LINK   : config[env].orderExportLink,
            currentPage   : currentPage,
            fromC         : fromC,
            toC           : toC,
            orderBy       : orderBy,
            lang          : lang,
            currentUser   : {
                              id: currUser.id,
                              isBuch: currUser.is_buch,
                              isTo: currUser.is_to,
                              codeSync: currUser.code_sync
                            },
            thisPageLink  : '/orders/',
            cssSrcs       : ['/assets/stylesheets/orders.css'],
            scriptSrcs    : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                             '/assets/javascripts/orders.js']
          });
        }).catch(function(err) {
          console.log(err);
          res.send('Internal server error.');
        });
      });
    });
  });
}

/**
 * Helpers
 * [1] - get the latest order for current user
 * [2] - form `where` object for orders query
 * [3] - form `include` object for orders query
 */

// [1]
function getTimeWhereTemplate(rights, factoryId, userId) {
  if (rights) {
    return {
      user_id: userId
    };
  } else {
    return {
      user_id: userId,
      is_own: 1
    };
  }
}

// [2]
function getOrderWhereTemplate(rights, factoryId, userId, from, to) {
  if (rights) {
    return {
      modified: {
        $between: [new Date(from), new Date(to)]
      },
      user_id: userId
    };
  } else {
    return {
      modified: {
        $between: [new Date(from), new Date(to)]
      },
      user_id: userId,
      is_own: 1
    };
  }
}

// [3]
function getOrderIncludeTemplate(rights, factoryId, userId) {
  if (rights) {
    return [{
      model: models.orders,
      where: {
        $or: [{
          user_id: userId
        }, {
          sended: {
            $ne: new Date(0)
          }
        }]
      },
      include: [{
        model: models.order_products
      }]
    }, {
      model: models.users,
      include: {
        model: models.cities
      }
    }];
  } else {
    return [{
      model: models.orders,
      where: {
        $or: [{
          user_id: userId
        }, {
          sended: {
            $ne: new Date(0)
          }
        }]
      },
      include: [{
        model: models.order_products
      }]
    }, {
      model: models.users,
      include: {
        model: models.cities
      }
    }];
  }
}
