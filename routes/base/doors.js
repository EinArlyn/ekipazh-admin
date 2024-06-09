var router = require('express').Router();
var doors = require('../../controllers/base/doors');

router.get('/', doors.index);
router.post('/group/add', doors.addGroup);
router.post('/group/edit', doors.editGroup);
router.post('/group/update', doors.updateGroup);
router.post('/folder/add', doors.addFolder);
router.get('/folder/open/:id', doors.openFolder);
router.post('/folder/edit', doors.editFolder);
router.get('/options', doors.getOptions);
router.post('/dependency/add', doors.addDependency);
router.get('/dependency/get/:id', doors.getDependecies);
router.post('/dependency/update', doors.updateDependency);

module.exports = router;
