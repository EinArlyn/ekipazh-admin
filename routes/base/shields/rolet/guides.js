var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.guides);
router.get('/guide/getGuide/:id', isAuthenticated, getGuide);
router.get('/guide/getBoxes', isAuthenticated, getBoxes);
router.post('/guide/add', isAuthenticated, rolet.addNewGuide);
router.post('/guide/edit', isAuthenticated, rolet.editGuide);
router.post('/guide/delete', isAuthenticated, rolet.deleteGuide);
router.post('/guide/active/:id', isAuthenticated, activeGuide);

function activeGuide(req, res) {
    models.rol_guides.findOne({
        where: {id: req.params.id}
    }).then(function(guide) {
        if (guide){
            guide.updateAttributes({
                is_activ: guide.is_activ ? 0 : 1 
            })
            res.send({status: true});
        } else {
            res.send({status: false});
        }
    })
}

function getGuide(req,res) {
    models.rol_guides.findOne({
        where: {id: req.params.id}
    }).then(function(guide) {
        if (guide) {
            res.send({status: true, guide: guide});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}

function getBoxes(req, res) {
    models.rol_groups.findAll({
        where: {factory_id: req.session.user.factory_id}
    }).then(function(rol_groups) {
        models.rol_guide_box_price_rules.findAll({}).then(function(rules) {

            rol_groups.sort((a,b) => a.position - b.position);
            res.send({status: true, groups: rol_groups, rules: rules});
        });
    });
}



module.exports = router;
