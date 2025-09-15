var models = require('../../../lib/models');

/**
 * Get list contents
 * @param {integer} params.id - List id
 */
module.exports = function getElementConsist(req, res) {
  var listId = req.params.id;
  models.list_contents
    .findAll({
      where: { child_id: listId },
      //include: { model: models.rules_types }
    })
    .then(function (list_contents) {
      const listConsist = [];
      models.lists.findAll({}).then(function (list_info) {
        list_contents.forEach((cont) => {
          const findElem = list_info.find(
            (elem) => elem.id === cont.parent_list_id
          );
          if (findElem) {
            listConsist.push({
              name: findElem.name,
              id: findElem.id,
            });
          }
        });
        listConsist.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        );
        res.send(listConsist);
      });
    });
};
