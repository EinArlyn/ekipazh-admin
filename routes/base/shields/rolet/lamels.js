var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.lamels);
router.post('/lamel/add', isAuthenticated, rolet.addNewLamel);
router.post('/lamel/edit', isAuthenticated, rolet.editLamel);
router.post('/lamel/delete', isAuthenticated, rolet.deleteLamel);
// router.post('/system/add', isAuthenticated, rolet.addNewSystem);
// router.post('/system/edit', isAuthenticated, rolet.editSystem);
// router.post('/system/delete', isAuthenticated, rolet.deleteSystem);

// router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/lamel/active/:id', isAuthenticated, activeLamel);

function activeLamel(req, res) {
    console.log('lamel>>',req.params);
    // models.rol_end_lists.findOne({
    //     where: {id: req.params.id}
    // }).then(function(end_list) {
    //     if (end_list){
    //         end_list.updateAttributes({
    //             is_activ: end_list.is_activ ? 0 : 1 
    //         })
    //         res.send({status: true});
    //     } else {
    //         res.send({status: false});
    //     }
    // })
}
// function activeGroup(req, res) {
//     console.log('group>>',req.params);
// }


module.exports = router;
