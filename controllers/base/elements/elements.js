var models = require('../../../lib/models');
var i18n = require('i18n');

/** TODO: Get types from DB */
var allTypesOfElements = [1, 2, 3, 5, 6, 8, 9, 10, 16, 17, 18, 19, 21, 15, 0, 22];
var elementTypes = [{type:0, name:'Все'}, {type:1, name:'Профили'},
  {type:3, name:'Армирование'}, {type:8, name:'Стеклопакеты'},
  {type:2, name:'Фурнитура'}, {type:6, name:'Штучные'},
  {type:5, name:'Уплотнители'}, {type:19, name:'Профили дополнительные'},
  {type:9, name:'Поверхностные'}, {type:10, name:'Жидкие'},
  {type:21, name:'Весовые'}, {type: 22, name: 'Новые'}];
/***/

var itemsPerPage = 20;
var orderLast;

/**
 * Get all elements
 * @param {integer} page - Page number of available elements
 * @param {array.integer} element_group_id - An array of element's groups id
 * @param {integer} query.type - Element type
          [default] 0
 * @param {integer} query.order - Sort value (sort by name, supplier, sku, currency)
 * @param {sting} query.queryName - Query string from search nav bar
 */
module.exports = function (req, res) {
  var filterTypes, queryName = '';
  var orderBy = req.query.order || 'name';
  var type = parseInt(req.query.type);
  var page = parseInt(req.params.page) || 0;
  var offset = page * itemsPerPage;

  /* reverse sorting */
  if (orderBy === orderLast && req.query.changeElType == '1') {
    orderBy = orderBy + ' DESC';
  }

  /* group filter */
  if (req.query.type && type !== 0) {
    filterTypes = type;
  } else {
    filterTypes = allTypesOfElements;
    type = 0;
  }

  /* search nav bar */
  if (req.query.queryName || req.query.queryName === '') {
    queryName = req.query.queryName;
  }

  orderLast = orderBy;

  models.sequelize.query("" +
    "SELECT E.id, E.name, E.sku, E.price, S.name AS supplier, C.name AS currency, " +
      "(SELECT COUNT(E.id) FROM elements E JOIN suppliers S ON E.supplier_id = S.id " +
      "WHERE E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND UPPER(E.name) LIKE UPPER('%" + queryName + "%')" +
        " AND E.element_group_id IN (" + filterTypes + ")" +
      " OR (E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND UPPER(E.sku) LIKE UPPER('%" + queryName + "%')" +
        " AND E.element_group_id IN (" + filterTypes + "))" +
      " OR (E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND UPPER(S.name) LIKE UPPER('%" + queryName + "%')" +
        " AND E.element_group_id IN (" + filterTypes + "))" + ") AS rowscounter " +
      "FROM elements E " +
      "JOIN suppliers S " +
      "ON E.supplier_id = S.id " +
      "JOIN currencies C " +
      "ON E.currency_id = C.id " +
      "WHERE E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND UPPER(E.name) LIKE UPPER('%" + queryName + "%')" +
        " AND E.element_group_id IN (" + filterTypes + ")" +
      " OR (E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND UPPER(E.sku) LIKE UPPER('%" + queryName + "%')" +
        " AND E.element_group_id IN (" + filterTypes + "))" +
      " OR (E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND UPPER(S.name) LIKE UPPER('%" + queryName + "%')" +
        " AND E.element_group_id IN (" + filterTypes + "))" +
      " GROUP BY E.id, S.name, C.name" +
      " ORDER BY " + orderBy +
      " LIMIT " + itemsPerPage +
      " OFFSET " + offset +
  "").then(function (result) {
    models.elements_groups.findAll().then(function (elements_groups) {
      var totalPages = 1;
      var currentPage = parseInt(req.params.page || 0);

      if (result[0].length) {
        totalPages = Math.ceil(result[0][0].rowscounter / itemsPerPage);
      }

      res.render('base/elements', {
        i18n          : i18n,
        title         : i18n.__('Elements list'),
        elements      : result,
        totalPages    : totalPages,
        currentPage   : currentPage,
        type          : type,
        orderBy       : orderBy,
        queryName     : queryName,
        elementTypes  : elementTypes,
        elementGroups : elements_groups,
        thisPageLink  : '/base/elements/',
        cssSrcs       : ['/assets/stylesheets/base/elements.css'],
        scriptSrcs    : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                         '/assets/javascripts/base/elements.js']
      });
    }).catch(function (error) {
      console.log(error);
      res.send('Internal server error.');
    });
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.');
  });
};
