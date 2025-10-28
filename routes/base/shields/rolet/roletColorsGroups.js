var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.roletColorsGroups);
// router.get('/lamel/getLamel/:id', isAuthenticated, getLamel);
// router.get('/lamel/getGuides', isAuthenticated, getGuides);
// router.get('/lamel/getEndLists', isAuthenticated, getEndLists);
// router.post('/lamel/add', isAuthenticated, rolet.addNewLamel);
// router.post('/lamel/edit', isAuthenticated, rolet.editLamel);
// router.post('/lamel/delete', isAuthenticated, rolet.deleteLamel);

// router.post('/lamel/active/:id', isAuthenticated, activeLamel);
// router.get('/lamel/getEditLamelInfo/:id', isAuthenticated, getEditLamelInfo);





module.exports = router;
