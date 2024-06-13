var router = require('express').Router();
var dashboard = require('../controllers/dashboard/en');

router.get('/', dashboard.index);
router.post('/', dashboard.signin);
router.get('/logout', dashboard.signout);
router.get('/login', dashboard.login);

/** Old avatars storage is not available. This route send default avatar */
router.get('/uploadsfoto/:id', function (req, res) {
  res.redirect('/local_storage/avatars/default.png');
});

module.exports = router;
