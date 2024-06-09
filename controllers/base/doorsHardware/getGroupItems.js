'use strict';

var models = require('../../../lib/models');
var ITEMS_PER_PAGE = 20;

/**
 * Get door's hardware items
 */
module.exports = function (req, res) {
  var page = parseInt(req.query.page, 10) || 0;
  var offset = ITEMS_PER_PAGE * page;

  models.doors_hardware_items.findAndCountAll({
    where: {
      hardware_group_id: req.params.hardwareGroupId
    },
    include: [{ model: models.lamination_factory_colors, required: false }],
    limit: ITEMS_PER_PAGE,
    order: 'id',
    offset: offset
  }).then(function (items) {
    /** Filter all included items in set */
    var filteredElements = [-1];
    var filteredSets = [-1];

    items.rows.filter(function(child) {
      if (child.child_type === 'element') {
        filteredElements.push(child.child_id);
      } else if (child.child_type === 'list') {
        filteredSets.push(child.child_id);
      }
    });

    models.lists.findAll({
      where: { id: filteredSets },
      attributes: ['id', 'name']
    }).then(function (lists) {
      models.elements.findAll({
        where: { id: filteredElements },
        attributes: ['id', 'name']
      }).then(function (elements) {
        res.send({
          status: true,
          items: items,
          totalPages: Math.ceil(items.count / ITEMS_PER_PAGE),
          lists: lists,
          elements: elements
        });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false, error: error });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
