var router = require('express').Router();
var folders = require('../../../controllers/base/options/folders');

router.get('/get/:id', folders.get);
router.post('/add', folders.add);
router.post('/edit', folders.edit);
router.post('/remove', folders.remove);

module.exports = router;
