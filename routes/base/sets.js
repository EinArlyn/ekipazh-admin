var express = require('express');
var router = express.Router();
var i18n = require('i18n');

var models = require('../../lib/models');
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;
var util = require('util');

var itemsPerPage = 20;
var allTypesOfLists = [7, 2, 3, 4, 5, 6, 8, 9, 10, 16, 17, 18, 19, 21, 15, 0, 11, 12, 13, 20, 22, 24, 25, 23, 26, 27, 28, 29, 30, 31, 32];
var listTypes = [{type:0, name:'Все'}, {type:2, name:'Рама'}, {type:3, name:'Створка'},
    {type:4, name:'Импост'}, {type:5, name:'Штапик'}, {type:6, name:'Стеклопакеты'},
    {type:7, name:'Армирование'}, {type:8, name:'Подоконники'}, {type:9, name:'Отливы'},
    {type:10, name:'Москитные сетки профиль'}, {type:11, name:'Штульпы'}, {type:12, name:'Соединительные профиля'},
    {type:13, name:'Расширительные профиля'}, {type:16, name:'Фурнитура'}, {type:17, name:'Штучные'},
    {type:18, name:'Штучные ПРОЧЕЕ'}, {type:19, name:'Откосы'}, {type:20, name:'Москитные сетки'},
    {type:21, name:'Козырьки, нащельники'}, {type:22, name:'Дистанционные рамки'}, {type:24, name:'Ручки'},
    {type:25, name:'Шпрос'}, {type:23, name:'Дверная Фурнитура'}, {type: 26, name: 'Жалюзи'},
    {type: 27, name: 'Микропроветривание'}, {type: 28, name: 'Ролеты'}, {type: 29, name: 'Ставни'},
    {type: 30, name: 'Наружный переплет'}, {type: 31, name: 'Наружные откосы'},
    {type: 32, name: 'Внутренние откосы'}];

router.get('/', isAuthenticated, getSetsList);
router.get('/:page', isAuthenticated, getSetsList);
router.post('/removeSet/:id', isAuthenticated, removeSet);


function getSetsList(req, res) {
  var filterTypes, queryName = '';
  var type = parseInt(req.query.type, 10);
  var page = parseInt(req.params.page, 10) || 0;
  var orderBy = 'name';
  var offset = page * itemsPerPage;

  if (req.query.type && type !== 0) {
    filterTypes = type;
  } else {
    filterTypes = allTypesOfLists;
    type = 0;
  }

  if (req.query.queryName || req.query.queryName === '') {
    queryName = req.query.queryName;
  }

  models.sequelize.query("SELECT L.id, L.name, LG.name AS list_group, E.name AS element_name, " +
                          "(SELECT COUNT(L.id) FROM lists L JOIN elements E ON L.parent_element_id = E.id " +
                          "WHERE E.factory_id = " + parseInt(req.session.user.factory_id, 10) +
                            " AND L.list_group_id IN (" + filterTypes + ")" +
                            " AND UPPER(L.name) LIKE UPPER('%" + queryName + "%')" +
                          " OR (E.factory_id = " + parseInt(req.session.user.factory_id, 10) +
                            " AND L.list_group_id IN (" + filterTypes + ")" +
                            " AND UPPER(E.name) LIKE UPPER('%" + queryName + "%'))" + ") AS rowscounter " +
                         "FROM lists L " +
                         "JOIN elements E " +
                         "ON L.parent_element_id = E.id " +
                         "JOIN lists_groups LG " +
                         "ON L.list_group_id = LG.id " +
                         "WHERE E.factory_id = " + parseInt(req.session.user.factory_id, 10) +
                          " AND L.list_group_id IN (" + filterTypes + ")" +
                          " AND UPPER(L.name) LIKE UPPER('%" + queryName + "%')" +
                         " OR (E.factory_id = " + parseInt(req.session.user.factory_id, 10) +
                          " AND L.list_group_id IN (" + filterTypes + ")" +
                          " AND UPPER(E.name) LIKE UPPER('%" + queryName + "%'))" +
                         " ORDER BY " + orderBy +
                         " LIMIT " + itemsPerPage +
                         " OFFSET " + offset +
    "").then(function(result) {
      var currentPage = parseInt(req.params.page, 10) || 0;
      var totalPages = 1;

      if (result[0].length) {
        totalPages = Math.ceil(result[0][0].rowscounter / itemsPerPage);
      }

      res.render('base/sets', {
        i18n          : i18n,
        title         : i18n.__('Sets list'),
        lists         : result,
        totalPages    : totalPages,
        currentPage   : currentPage,
        type          : type,
        queryName     : queryName,
        listTypes     : listTypes,
        thisPageLink  : '/base/sets/',
        cssSrcs       : ['/assets/stylesheets/base/sets.css'],
        scriptSrcs    : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                          '/assets/javascripts/base/sets.js']
      });
  });
}

/**
 * Remove list from lists
 * @param {integer} id
 */
function removeSet(req, res) {
  var id = req.params.id;

  models.beed_profile_systems.findAll({
    where: {list_id: id}
  }).then(function(beedsPS) {
    if (beedsPS.length) {
      for (var i = 0, len = beedsPS.length; i < len; i++) {
        beedsPS[i].destroy();
      }
    }
    setTimeout(function() {
      models.lists.findOne({
        where: {id: id}
      }).then(function(list) {
        list.destroy().then(function(result) {
          if (result) {
            res.send({status: true});
          } else {
            res.send({status: false});
          }
        }).catch(function(err) {
          console.log(err);
          if (err) {
            res.send({status: false});
          }
        });
      });
    }, 300);
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });

}

module.exports = router;
