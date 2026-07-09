var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.grids);
router.post('/addGrid', isAuthenticated, grids.addGrid);
router.post('/editGrid', isAuthenticated, grids.editGrid);
router.post('/deleteGrid', isAuthenticated, grids.deleteGrid);
router.post('/addLinkElement', isAuthenticated, grids.addLinkElement);
router.post('/editLinkElement', isAuthenticated, grids.editLinkElement);
router.post('/deleteLinkElement', isAuthenticated, grids.deleteLinkElement);
router.get('/getCurrencies', isAuthenticated, getCurrencies);
router.get('/getGrid/:id', isAuthenticated, getGrid);
router.get('/getElements', isAuthenticated, getElements);
router.get('/getLinkElements/:gridId/:elementId', isAuthenticated, getLinkElements);


function getCurrencies(req,res) {
    models.currencies.findAll({
        where: { factory_id: req.session.user.factory_id, id: [102, 684, 685] }
    }).then(function(currencies) {
        res.send({status: true, currencies: currencies});
    })
}

function getGrid(req,res) {
    models.pls_grids.findOne({
        where: {id: req.params.id}
    }).then(function(grid) {
        res.send({status: true, grid: grid});
    });
}

function getElements(req,res) {
    models.pls_elements.findAll({
        where: { factory_id: req.session.user.factory_id }
    }).then(function(elements) {
        elements.sort((a, b) => a.name.localeCompare(b.name));
        res.send({status: true, elements: elements});
    });
}

function getLinkElements(req,res) {
    models.pls_links.findOne({
        where: {
            parent_id: req.params.gridId,
            element_id: req.params.elementId,
            parent_type_id: 2
        }
    }).then(function(linkElement) {
        res.send({status: true, linkElement: linkElement});
    });
}

module.exports = router;
