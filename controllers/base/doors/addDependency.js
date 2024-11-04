'use strict';

var models = require('../../../lib/models');

/**
 * Add new door group dependency
 * @param {integer} body.laminationIn - New dependency name
 * @param {integer} body.laminationOut - New dependency name
 */
module.exports = function (req, res) {
  console.log('here', req.body);
  models.doors_laminations_dependencies.create({
    group_id: parseInt(req.body.groupId, 10),
    lamination_in: parseInt(req.body.laminationIn, 10),
    lamination_out: parseInt(req.body.laminationOut, 10),
    rama_list_id: parseInt(req.body.ramaListId, 10),
    door_sill_list_id: parseInt(req.body.doorSillListId, 10),
    stvorka_list_id: parseInt(req.body.stvorkaListId, 10),
    impost_list_id: parseInt(req.body.impostListId, 10),
    impost_in_stvorka_list_id: parseInt(req.body.impostStvorkaListId, 10),
    shtulp_list_id: parseInt(req.body.shtulpListId, 10),
    rama_sill_list_id: parseInt(req.body.ramaSillListId, 10),
    code_sync: req.body.codeSync,
    modified: new Date()
  }).then(function (newDependency) {
    res.send({ status: true, dependency: newDependency });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
