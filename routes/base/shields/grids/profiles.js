var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.profiles);
router.post('/addProfile', isAuthenticated, grids.addProfile);
router.post('/editProfile', isAuthenticated, grids.editProfile);
router.post('/deleteProfile', isAuthenticated, grids.deleteProfile);
router.post('/addLinkElement', isAuthenticated, grids.addLinkElement);
router.post('/editLinkElement', isAuthenticated, grids.editLinkElement);
router.post('/deleteLinkElement', isAuthenticated, grids.deleteLinkElement);
router.get('/getCurrencies', isAuthenticated, getCurrencies);
router.get('/getProfile/:id', isAuthenticated, getProfile);
router.get('/getElements', isAuthenticated, getElements);
router.get('/getLinkElements/:profileId/:elementId', isAuthenticated, getLinkElements);


function getCurrencies(req,res) {
    models.currencies.findAll({
        where: { factory_id: req.session.user.factory_id, id: [102, 684, 685] }
    }).then(function(currencies) {
        res.send({status: true, currencies: currencies});
    })
}

function getProfile(req,res) {
    models.pls_profiles.findOne({
        where: {id: req.params.id}
    }).then(function(profile) {
        res.send({status: true, profile: profile});
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
            parent_id: req.params.profileId,
            element_id: req.params.elementId,
            parent_type_id: 1
        }
    }).then(function(linkElement) {
        res.send({status: true, linkElement: linkElement});
    });
}

module.exports = router;
