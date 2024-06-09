var router = require('express').Router();
var elementsController = require('../../controllers/base/elements');

router.get('/', elementsController.index);
router.get('/:page', elementsController.index);
router.get('/getCurrentElements/:groupId', elementsController.getCurrentElements);
router.post('/duplicateElement/:id', elementsController.duplicateElement);
router.get('/getSetsCount/:id', elementsController.getSetsCount);
router.post('/deleteElement/', elementsController.deleteElement);

module.exports = router;
