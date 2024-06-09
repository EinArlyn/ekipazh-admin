var router = require('express').Router();
var mosquito = require('../../controllers/mosquito');
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, mosquito.index);
router.post('/', isAuthenticated, mosquito.addNewMosquito);
router.get('/profile/:id', isAuthenticated, mosquito.getProfileMosquitos);
router.get('/unbinded', isAuthenticated, mosquito.getUnbindedMosquitos);
router.post('/option/:id', isAuthenticated, mosquito.changeOption);
router.post('/name', isAuthenticated, mosquito.changeMosquito);
router.get('/folders', isAuthenticated, mosquito.getMosquitosFolders);

module.exports = router;
