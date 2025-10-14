var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.roletPrice);
router.get('/getPrices', isAuthenticated, getPrices);
// router.get('/guide/getGuide/:id', isAuthenticated, getGuide);
// router.post('/guide/add', isAuthenticated, rolet.addNewGuide);
// router.post('/guide/edit', isAuthenticated, rolet.editGuide);
// router.post('/guide/delete', isAuthenticated, rolet.deleteGuide);


// router.post('/guide/active/:id', isAuthenticated, activeGuide);

function getPrices(req, res) {
    models.rol_prices.findAll({}).then(function(prices){
        res.send({status: true, prices: prices});
    })
}


module.exports = router;
