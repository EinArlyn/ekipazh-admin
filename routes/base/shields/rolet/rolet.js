var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.index);
router.post('/', isAuthenticated, rolet.addNewGroupSystem);
router.post('/group/edit', isAuthenticated, rolet.editGroupSystem);
router.post('/group/delete', isAuthenticated, rolet.deleteGroupSystem);
router.post('/system/add', isAuthenticated, rolet.addNewSystem);
router.post('/system/edit', isAuthenticated, rolet.editSystem);
router.post('/system/delete', isAuthenticated, rolet.deleteSystem);

router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/system/active/:id', isAuthenticated, activeSystem);

function activeSystem(req, res) {
    console.log('system>>',req.params);
}
function activeGroup(req, res) {
    console.log('group>>',req.params);
}
// router.post('/', isAuthenticated, mosquito.addNewMosquito);
// router.get('/profile/:id', isAuthenticated, mosquito.getProfileMosquitos);
// router.get('/unbinded', isAuthenticated, mosquito.getUnbindedMosquitos);
// router.post('/option/:id', isAuthenticated, mosquito.changeOption);
// router.post('/name', isAuthenticated, mosquito.changeMosquito);
// router.get('/folders', isAuthenticated, mosquito.getMosquitosFolders);

module.exports = router;
