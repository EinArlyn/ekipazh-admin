var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.colors);
router.post('/addColorGroup', isAuthenticated, grids.addColorGroup);
router.post('/editColorGroup', isAuthenticated, grids.editColorGroup);
router.post('/deleteColorGroup', isAuthenticated, grids.deleteColorGroup);
router.post('/addColor', isAuthenticated, grids.addColor);
router.post('/editColor', isAuthenticated, grids.editColor);
router.post('/deleteColor', isAuthenticated, grids.deleteColor);
router.get('/getGroup/:id', isAuthenticated, getGroup);
router.get('/getColor/:id', isAuthenticated, getColor);
router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/color/active/:id', isAuthenticated, activeColor);

function activeColor(req, res) {
    models.pls_profile_colors.findOne({
        where: {id: req.params.id}
    }).then(function(color) {
        color.updateAttributes({
            is_active: color.is_active ? 0 : 1
        })
        res.send({status: true});
    })
}

function activeGroup(req, res) {
    models.pls_profile_colors_groups.findOne({
        where: {id: req.params.id}
    }).then(function(group) {
        group.updateAttributes({
            is_active: group.is_active ? 0 : 1
        })
        res.send({status: true});
    })
}


function getGroup(req,res) {
    models.pls_profile_colors_groups.findOne({
        where: {id: req.params.id}
    }).then(function(group) {
        res.send({status: true, group: group});
    });
}

function getColor(req,res) {
    models.pls_profile_colors.findOne({
        where: {id: req.params.id}
    }).then(function(color) {
        res.send({status: true, color: color});
    });
}



module.exports = router;
