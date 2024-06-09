var models = require('../../../lib/models');

/**
 * Get list contents
 * @param {integer} params.id - List id
 */
module.exports = function getListContents (req, res) {
  var listId = req.params.id;

  models.list_contents.findAll({
    where: { parent_list_id: listId },
    //include: { model: models.rules_types }
  }).then(function (list_contents) {
    var filteredElements = [];
    var filteredSets = [];
    //console.log(list_contents);
    list_contents.filter(function (child) {
      if (child.child_type === 'element') {
        filteredElements.push(child.child_id);
      } else if (child.child_type === 'list') {
        filteredSets.push(child.child_id);
      }
    });

    models.elements.findAll({
      where: {
        id: {
          in: filteredElements
        }
      },
      include: {
        model: models.list_contents,
        where: {
          parent_list_id: listId
        },
        include: {
          model: models.rules_types
        }
      }
    }).then(function (elementsChilds) {   // all included elements in set
      models.lists.findAll({
        where: {
          id: {
            in: filteredSets
          }
        },
        include: {
          model: models.list_contents,
          where: {
            parent_list_id: listId
          },
          include: {
            model: models.rules_types
          }
        }
      }).then(function (listsChilds) {           // all included sets in set
        res.send({
          lists: listsChilds,
          elements: elementsChilds
        });
      });
    });
  });
};
