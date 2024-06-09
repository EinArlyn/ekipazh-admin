var router = require('express').Router();
var WindowGlassController = require('../../controllers/base/glazedWindow');

router.get('/', WindowGlassController.index);
router.get('/getGlass/:id', WindowGlassController.getGlass);
router.get('/getSimilarities/', WindowGlassController.getSimilarities);
router.post('/newSimilarity/', WindowGlassController.newSimilarity);
router.post('/addGlassToSimilarity/', WindowGlassController.addGlassToSimilarity);
router.post('/removeGlassFromSimilarity/', WindowGlassController.removeGlassFromSimilarity);
router.get('/checkSimilarity', WindowGlassController.checkSimilarity);

module.exports = router;
