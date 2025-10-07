var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.guides);
router.post('/guide/add', isAuthenticated, rolet.addNewGuide);
router.post('/guide/edit', isAuthenticated, rolet.editGuide);
router.post('/guide/delete', isAuthenticated, rolet.deleteGuide);
// router.post('/system/add', isAuthenticated, rolet.addNewSystem);
// router.post('/system/edit', isAuthenticated, rolet.editSystem);
// router.post('/system/delete', isAuthenticated, rolet.deleteSystem);

// router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/guide/active/:id', isAuthenticated, activeGuide);

function activeGuide(req, res) {
    console.log('>>>>>>>>>>>',req.params)
    models.rol_guides.findOne({
        where: {id: req.params.id}
    }).then(function(guide) {
        if (guide){
            console.log(guide)
            guide.updateAttributes({
                is_activ: guide.is_activ ? 0 : 1 
            })
            res.send({status: true});
        } else {
            res.send({status: false});
        }
    })
}
// function activeGroup(req, res) {
//     console.log('group>>',req.params);
// }


module.exports = router;
