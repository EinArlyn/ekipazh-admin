var express = require('express');
var router = express.Router();
var i18n = require('i18n');

var models = require('../../lib/models');
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, getSills);
router.get('/get-sills-from-group/:groupId', isAuthenticated, getSillsFromGroup);
router.post('/add-new-group', isAuthenticated, addNewGroup);
router.get('/get-group/:groupId', isAuthenticated, getGroup);
router.post('/edit-group/:groupId', isAuthenticated, editGroup);
router.get('/get-sills-without-group', isAuthenticated, getSillsWithoutGroup);
router.post('/add-sill-to-group/:groupId', isAuthenticated, addSillToGroup);
router.get('/get-sill/:sillId', isAuthenticated, getSill);
router.post('/edit-sill/:sillId', isAuthenticated, editSill);

/** Get all sills groups witch included sills */
function getSills(req, res) {
  var factoryId = req.session.user.factory_id;

  models.sills_groups.findAll({
    where: {factory_id: factoryId}
  }).then(function(sillsGroups) {
    models.lists.findAll({
      where: {list_group_id: 8, sills_group: 0},
      include: {model: models.elements, where: {factory_id: factoryId}}
    }).then(function(sills) {
      res.render('base/sills', {
        i18n: i18n,
        title: 'Подоконники',
        sillsGroups: sillsGroups,
        sills: sills,
        cssSrcs: ['/assets/stylesheets/base/sills.css'],
        scriptSrcs: ['/assets/javascripts/base/sills.js']
      });
    });
  }).catch(function(err) {
    console.log(err);
  });
}

/**
 * Get sills from group
 * @param {integer}  groupId
 */
function getSillsFromGroup(req, res) {
  var groupId = req.params.groupId;
  //var factoryId = req.session.user.factory_id;
  //console.log(groupId, factoryId);

  models.lists.findAll({
    where: {list_group_id: 8, sills_group: parseInt(groupId)}
    //include: {model: models.elements, where: {factory_id: factoryId}}
  }).then(function(sills) {
    res.send({status: true, sills: sills});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Add new sills group
 * @param {string} name    - name of new group
 */
function addNewGroup(req, res) {
  var name = req.body.name;

  models.sills_groups.create({
    name: name,
    factory_id: parseInt(req.session.user.factory_id, 10),
    modified: new Date()
  }).then(function() {
    res.send({status: true});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Get sill group
 * @param {integer} groupId
 */
function getGroup(req, res) {
  var groupId = req.params.groupId;

  models.sills_groups.findOne({
    where: {id: parseInt(groupId, 10)}
  }).then(function(group) {
    res.send({status: true, group: group});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Edit group
 * @param {integer} groupId
 * @param {string}  name
 */
function editGroup(req, res) {
  var groupId = req.params.groupId;
  var name = req.body.name;

  models.sills_groups.findOne({
    where: {id: groupId}
  }).then(function(group) {
    group.updateAttributes({
      name: name,
      modified: new Date()
    }).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Get sills without group
 */
function getSillsWithoutGroup(req, res) {
  models.lists.findAll({
    where: {list_group_id: 8, sills_group: 0},
    include: {model: models.elements, where: {factory_id: req.session.user.factory_id}}
  }).then(function(sills) {
    res.send({status: true, sills: sills});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Add sill to group
 * @param {integer}  groupId
 * @param {integer}  sillId
 */
function addSillToGroup(req, res) {
  var groupId = req.params.groupId;
  var sillId = req.body.sillId;

  models.lists.findOne({
    where: {id: parseInt(sillId, 10)}
  }).then(function(sill) {
    sill.updateAttributes({
      sills_group: parseInt(groupId, 10)
    }).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Get sill
 * @param {integer} sillId
 */
function getSill(req, res) {
  var sillId = req.params.sillId;

  models.lists.findOne({
    where: {id: parseInt(sillId, 10)}
  }).then(function(sill) {
    models.sills_groups.findAll({
      where: {factory_id: parseInt(req.session.user.factory_id, 10)}
    }).then(function(sillsGroups) {
      res.send({status: true, sill: sill, sillsGroups: sillsGroups});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Edit sill
 * @param {integer} sillId
 * @param {integer} groupId
 */
function editSill(req, res) {
  var sillId = req.params.sillId;
  var groupId = req.body.groupId;

  models.lists.findOne({
    where: {id: parseInt(sillId, 10)}
  }).then(function(sill) {
    sill.updateAttributes({
      sills_group: parseInt(groupId, 10)
    }).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

module.exports = router;
