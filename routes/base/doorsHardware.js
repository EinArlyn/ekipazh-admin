var router = require('express').Router();
var doorsHardwareCtrl = require('../../controllers/base/doorsHardware');

router.get('/', doorsHardwareCtrl.index);
router.post('/groups/add', doorsHardwareCtrl.addGroup);
router.get('/groups/get/:hardwareTypeId', doorsHardwareCtrl.getGroups);
router.get('/group/get/:id', doorsHardwareCtrl.getGroup);
router.post('/group/edit', doorsHardwareCtrl.editGroup);
router.get('/group/items/:hardwareGroupId', doorsHardwareCtrl.getGroupItems);
router.get('/dependency/door/:hardwareGroupId', doorsHardwareCtrl.getDoorGroupsDependency);
router.post('/dependency/door', doorsHardwareCtrl.updateDoorGroupsDependecy);
router.get('/locks/get', doorsHardwareCtrl.getAvailableLockLists);
router.post('/lock/add', doorsHardwareCtrl.addLockList);
router.post('/lock/remove', doorsHardwareCtrl.removeLockList);
router.get('/dependency/lock/:hardwareGroupId', doorsHardwareCtrl.getLockListDependency);
router.post('/item/add', doorsHardwareCtrl.addNewItem);
router.get('/item/:id', doorsHardwareCtrl.getItem);
router.post('/item/edit', doorsHardwareCtrl.editItem);
router.post('/item/remove', doorsHardwareCtrl.removeItem);
router.get('/is-push/:id', doorsHardwareCtrl.isHardwareGroupAvailableAsPush);

module.exports = router;
