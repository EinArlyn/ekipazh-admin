var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.endLists);
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
}
// function activeGroup(req, res) {
//     console.log('group>>',req.params);
// }


module.exports = router;
