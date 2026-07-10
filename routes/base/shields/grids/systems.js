var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.systems);
router.post('/addGroup', isAuthenticated, grids.addGroup);
router.post('/editGroup', isAuthenticated, grids.editGroup);
router.post('/deleteGroup', isAuthenticated, grids.deleteGroup);
router.post('/addSystem', isAuthenticated, grids.addSystem);
router.post('/editSystem', isAuthenticated, grids.editSystem);
router.post('/deleteSystem', isAuthenticated, grids.deleteSystem);
router.get('/getGroup/:id', isAuthenticated, getGroup);
router.get('/getSystem/:id', isAuthenticated, getSystem);
router.get('/getProfiles', isAuthenticated, getProfiles);
router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/system/active/:id', isAuthenticated, activeSystem);

function activeSystem(req, res) {
    models.pls_systems.findOne({
        where: {id: req.params.id}
    }).then(function(system) {
        system.updateAttributes({
            is_active: system.is_active ? 0 : 1
        })
        res.send({status: true});
    })
}

function activeGroup(req, res) {
    models.pls_system_groups.findOne({
        where: {id: req.params.id}
    }).then(function(group) {
        group.updateAttributes({
            is_active: group.is_active ? 0 : 1
        })
        res.send({status: true});
    })
}


function getGroup(req,res) {
    models.pls_system_groups.findOne({
        where: {id: req.params.id}
    }).then(function(group) {
        res.send({status: true, group: group});
    });
}

function getSystem(req,res) {
    models.pls_systems.findOne({
        where: {id: req.params.id}
    }).then(function(system) {
        res.send({status: true, system: system});
    });
}

function getProfiles(req,res) {
    models.pls_profiles.findAll({
        where: { factory_id: req.session.user.factory_id }
    }).then(function(profiles) {
        profiles.sort((a, b) => a.name.localeCompare(b.name));
        res.send({status: true, profiles: profiles});
    });
}


module.exports = router;
