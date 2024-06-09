var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var i18n = require('i18n');
var md5 = require('md5');
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;

router.get('/account/activate', activateAccount);
router.get('/get-countries', isAuthenticated, getCountries);
router.get('/get-location/:regionId/:countryId', isAuthenticated, getLocation);
router.get('/get-cities/:regionId', isAuthenticated, getCities);
router.get('/get-regions/:countryId', isAuthenticated, getRegions);

function activateAccount(req, res) {
  var userDeviceCode = req.query.k;

  models.users.findOne({
    where: {device_code: userDeviceCode}
  }).then(function(user) {
    user.updateAttributes({
      locked: 1
    }).then(function() {
      res.render('services/activate-account', {
        title: i18n.__('Activating account'),
        i18n: i18n,
        cssSrc: '/assets/stylesheets/services/activate-account.css',
        scriptSrcs: ['/assets/javascripts/services/activate-account.js']
      });
    }).catch(function(err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log(err);
  });
}

function getCountries(req, res) {
  models.countries.findAll().then(function(countries) {
    res.send({status: true, countries: countries});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function getLocation(req, res) {
  var regionId = req.params.regionId;
  var countryId = req.params.countryId;

  models.cities.findAll({
    where: {region_id: regionId},
    order: 'name'
  }).then(function(cities) {
    models.regions.findAll({
      where: {country_id: countryId}
    }).then(function(regions) {
      res.send({status: true, regions: regions, cities: cities});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function getCities(req, res) {
  var regionId = req.params.regionId;

  models.cities.findAll({
    where: {region_id: regionId},
    order: 'name'
  }).then(function(cities) {
    res.send({status: true, cities: cities});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function getRegions(req, res) {
  var countryId = req.params.countryId;

  models.regions.findAll({
    where: {country_id: countryId},
    order: 'name'
  }).then(function(regions) {
    res.send({status: true, regions: regions});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

module.exports = router; 