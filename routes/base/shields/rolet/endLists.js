var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.endLists);
router.get('/endList/getEndList/:id', isAuthenticated, getEndList);
router.post('/endList/add', isAuthenticated, rolet.addNewEndList);
router.post('/endList/edit', isAuthenticated, rolet.editEndList);
router.post('/endList/delete', isAuthenticated, rolet.deleteEndList);
// router.post('/system/add', isAuthenticated, rolet.addNewSystem);
// router.post('/system/edit', isAuthenticated, rolet.editSystem);
// router.post('/system/delete', isAuthenticated, rolet.deleteSystem);

// router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/endList/active/:id', isAuthenticated, activeEndList);

function activeEndList(req, res) {
    console.log('end list>>',req.params);
    models.rol_end_lists.findOne({
            where: {id: req.params.id}
        }).then(function(end_list) {
            if (end_list){
                end_list.updateAttributes({
                    is_activ: end_list.is_activ ? 0 : 1 
                })
                res.send({status: true});
            } else {
                res.send({status: false});
            }
        })
}

function getEndList(req,res) {
    models.rol_end_lists.findOne({
        where: {id: req.params.id}
    }).then(function(end_list) {
        if (end_list) {
            res.send({status: true, end_list: end_list});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}



module.exports = router;
