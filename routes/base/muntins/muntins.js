var router = require('express').Router();
var muntins = require('../../../controllers/muntins');
var models = require('../../../lib/models');
var isAuthenticated =
  require('../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, muntins.index);

router.post('/active/:id', isAuthenticated, activeSystem);
router.get('/getSystem/:id', isAuthenticated, getSystem);
router.get('/getWidths/:id', isAuthenticated, getWidths);
router.get('/getProfilesLinks', isAuthenticated, getProfilesLinks);
router.get('/getPtProfilesLinks', isAuthenticated, getPtProfilesLinks);
router.get('/getCurrencies', isAuthenticated, getCurrencies);

router.post('/add', isAuthenticated, muntins.addNewMuntins);
router.post('/edit', isAuthenticated, muntins.editMuntins);
router.post('/delete', isAuthenticated, muntins.deleteMuntins);

function activeSystem(req, res) {
  models.muntins
    .findOne({
      where: { id: req.params.id },
    })
    .then(function (system) {
      system.updateAttributes({
        is_active: system.is_active ? 0 : 1,
      });
      res.send({ status: true });
    });
}

function getWidths(req, res) {
  const muntinsId = req.params.id;
  models.muntins_widths
    .findAll({
      where: { muntins_id: muntinsId },
    })
    .then(function (widths) {
      res.send({ status: true, widths: widths });
    })
    .catch(function (err) {
      console.error('getWidths error:', err);
      res.send({ status: false });
    });
}


function getSystem(req, res) {
  const system = req.params.id;
  models.muntins
    .findOne({
      where: { id: system },
    })
    .then(function (system) {
      res.send({ status: true, system: system });
    })
    .catch(function () {
      res.send({ status: false });
    });
}


function getCurrencies(req, res) {
  models.currencies
    .findAll({
      where: { factory_id: req.session.user.factory_id },
    })
    .then(function (currencies) {
      res.send({ status: true, currencies: currencies });
    });
}



function getProfilesLinks(req, res) {
  models.profile_systems
    .findAll({})
    .then(function (profiles) {
      return models.muntins_profile_links
        .findAll({})
        .then(function (profileLinks) {
          res.send({
            status: true,
            profiles: profiles,
            profileLinks: profileLinks,
          });
        });
      })
    .catch(function (err) {
      console.error('getProfiles error:', err);
      res.send({ status: false });
    });
}



function getPtProfilesLinks(req, res) {
  try {
    if (!models.pt_profile_systems || !models.muntins_pt_profile_links) {
      return res.send({
        status: true,
        ptProfiles: [],
        ptProfileLinks: [],
      });
    }

    models.pt_profile_systems
      .findAll({})
      .then(function (ptProfiles) {
        return models.muntins_pt_profile_links
          .findAll({})
          .then(function (ptProfileLinks) {
            res.send({
              status: true,
              ptProfiles: ptProfiles,
              ptProfileLinks: ptProfileLinks,
            });
          });
      })
      .catch(function (err) {
        console.error('getPtProfiles error:', err);
        res.send({
          status: true,
          ptProfiles: [],
          ptProfileLinks: [],
        });
      });
  } catch (err) {
    console.error('getPtProfiles error:', err);
    res.send({
      status: true,
      ptProfiles: [],
      ptProfileLinks: [],
    });
  }
}


module.exports = router;
