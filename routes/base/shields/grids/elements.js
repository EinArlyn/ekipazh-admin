var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.index);
router.post('/addElement', isAuthenticated, grids.addElement);
router.post('/editElement', isAuthenticated, grids.editElement);
router.post('/deleteElement', isAuthenticated, grids.deleteElement);
router.get('/getCurrencies', isAuthenticated, getCurrencies);
router.get('/getElement/:id', isAuthenticated, getElement);


function getCurrencies(req,res) {
    models.currencies.findAll({
        where: { factory_id: req.session.user.factory_id, id: [102, 684, 685] }
    }).then(function(currencies) {
        res.send({status: true, currencies: currencies});
    })
}

function getElement(req,res) {
    models.pls_elements.findOne({
        where: {id: req.params.id}
    }).then(function(element) {
        res.send({status: true, element: element});
    });
}

module.exports = router;
