var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.index);
router.post('/addElement', isAuthenticated, grids.addElement);
router.post('/editElement', isAuthenticated, grids.editElement);
router.post('/deleteElement', isAuthenticated, grids.deleteElement);
router.post('/addLinkElement', isAuthenticated, grids.addLinkElement);
router.post('/editLinkElement', isAuthenticated, grids.editLinkElement);
router.post('/deleteLinkElement', isAuthenticated, grids.deleteLinkElement);
router.get('/getCurrencies', isAuthenticated, getCurrencies);
router.get('/getElement/:id', isAuthenticated, getElement);
router.get('/getElements', isAuthenticated, getElements);
router.get('/getLinkElements/:elementId/:subElementId', isAuthenticated, getLinkElements);


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
            parent_id: req.params.elementId,
            element_id: req.params.subElementId,
            parent_type_id: 3
        }
    }).then(function(linkElement) {
        res.send({status: true, linkElement: linkElement});
    });
}

module.exports = router;
