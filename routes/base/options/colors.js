var router = require('express').Router();
var colors = require('../../../controllers/base/options/colors');

router.get('/get/:id', colors.get);
router.post('/add', colors.add);
router.post('/edit', colors.edit);
router.post('/remove', colors.remove);


module.exports = router;
