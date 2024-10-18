var router = require('express').Router();
var ElementController = require('../../controllers/base/element');

router.get('/:id', ElementController.index);
router.post('/save/:id', ElementController.saveElement);
router.post('/set/create', ElementController.createSet);
router.get('/getProfilePrices/:id', ElementController.getProfilePrices);
router.get('/getGlassPrices/:id', ElementController.getGlassPrices);
router.post('/setElementProfileSystems/:id', ElementController.setElementProfileSystems);
router.post('/setElementGlassesFolders/:id', ElementController.setElementGlassesFolders);
router.post('/setGlassPrices/:id', ElementController.setGlassPrices);
router.get('/getListContents/:id', ElementController.getListContents);
router.get('/create/:type', ElementController.createNewElement);
router.post('/add/:type', ElementController.addNewElement);
router.get('/validate/:id', ElementController.validateHeaders);

module.exports = router;
