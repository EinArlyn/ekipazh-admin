var router = require('express').Router();
const { where } = require('sequelize');
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.roletColorsGroups);

router.get('/color/getGroup/:id', isAuthenticated, getColorGroup);
router.get('/color/getColor/:id', isAuthenticated, getColor);
router.post('/color/addGroup', isAuthenticated, rolet.roletAddGroup);
router.post('/color/editGroup', isAuthenticated, rolet.roletEditGroup);
router.post('/color/deleteGroup', isAuthenticated, rolet.roletDeleteGroup);
router.post('/color/addColor', isAuthenticated, rolet.roletAddColor);
router.post('/color/editColor', isAuthenticated, rolet.roletEditColor);
router.post('/color/deleteColor', isAuthenticated, rolet.roletDeleteColor);
router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/color/active/:id', isAuthenticated, activeColor);
// router.get('/lamel/getGuides', isAuthenticated, getGuides);
// router.get('/lamel/getEndLists', isAuthenticated, getEndLists);
// router.post('/lamel/edit', isAuthenticated, rolet.editLamel);
// router.post('/lamel/delete', isAuthenticated, rolet.deleteLamel);

// router.post('/lamel/active/:id', isAuthenticated, activeLamel);
// router.get('/lamel/getEditLamelInfo/:id', isAuthenticated, getEditLamelInfo);


function activeGroup(req, res) {
  const id = Number(req.params.id);

  models.rol_color_groups.findOne({ where: { id } })
    .then(group => {
      if (!group) return res.send({ status: false });
      const next = group.is_standart ? 0 : 1;

      return models.rol_color_groups.update(
        { is_standart: 0 },
        { where: { factory_id: group.factory_id, id: { $ne: id } } }
      ).then(() => group.update({ is_standart: next }))
       .then(() => res.send({ status: true, is_standart: next }));
    })
    .catch(err => {
      console.error(err);
      res.send({ status: false });
    });
}

function activeColor(req, res) {
    models.rol_colors.findOne({
        where: {id: req.params.id}
    }).then(function(system) {
        system.updateAttributes({
            is_activ: system.is_activ ? 0 : 1
        })
        res.send({status: true});
    })
}


function getColorGroup(req,res) {
    const groupId = parseInt(req.params.id, 10);
    models.rol_color_groups.findOne({
        where: {id: groupId}
    }).then(function(group) {
        res.send({status: true, group: group});
    }).catch(function(err){
        res.send({status: false});
    })
}
function getColor(req,res) {
    const colorId = parseInt(req.params.id, 10);
    models.rol_colors.findOne({
        where: {id: colorId}
    }).then(function(color) {
        res.send({status: true, color: color});
    }).catch(function(err){
        res.send({status: false});
    })
}

module.exports = router;
