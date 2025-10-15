var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.lamels);
router.get('/lamel/getLamel/:id', isAuthenticated, getLamel);
router.get('/lamel/getGuides', isAuthenticated, getGuides);
router.get('/lamel/getEndLists', isAuthenticated, getEndLists);
router.post('/lamel/add', isAuthenticated, rolet.addNewLamel);
router.post('/lamel/edit', isAuthenticated, rolet.editLamel);
router.post('/lamel/delete', isAuthenticated, rolet.deleteLamel);

router.post('/lamel/active/:id', isAuthenticated, activeLamel);
router.get('/lamel/getEditLamelInfo/:id', isAuthenticated, getEditLamelInfo);

function activeLamel(req, res) {
    // console.log('lamel>>',req.params);
    models.rol_lamels.findOne({
        where: {id: req.params.id}
    }).then(function(lamel) {
        if (lamel){
            lamel.updateAttributes({
                is_activ: lamel.is_activ ? 0 : 1 
            })
            res.send({status: true});
        } else {
            res.send({status: false});
        }
    })
}

function getLamel(req,res) {
    models.rol_lamels.findOne({
        where: {id: req.params.id}
    }).then(function(lamel) {
        if (lamel) {
            res.send({status: true, lamel: lamel});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}
function getGuides(req,res) {
    models.rol_guides.findAll({
    }).then(function(guides) {
        if (guides) {
            res.send({status: true, guides: guides});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}
function getEndLists(req,res) {
    models.rol_end_lists.findAll({
    }).then(function(endLists) {
        if (endLists) {
            res.send({status: true, endLists: endLists});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}

function getEditLamelInfo(req, res) {
  const lamelPromise = models.rol_lamels.findOne({
    where: { id: req.params.id }
  });

  const guidesPromise = models.rol_guides.findAll();
  const endListsPromise = models.rol_end_lists.findAll();
  const lamelsEndListsPromise = models.rol_lamels_end_lists.findAll({
    where: {rol_lamel_id: req.params.id}
  });
  const lamelsGidesPromise = models.rol_lamels_guides.findAll({
    where: {rol_lamel_id: req.params.id}
  });

  Promise.all([lamelPromise, guidesPromise, endListsPromise, lamelsEndListsPromise, lamelsGidesPromise])
    .then(function (results) {
      const [lamel, guides, endLists, lamelEndLists, lamelGuides] = results;

      if (!lamel) {
        return res.send({ status: false });
      }

      res.send({
        status: true,
        lamel: lamel,
        guides: guides || [],
        endLists: endLists || [],
        lamelEndLists: lamelEndLists || [],
        lamelGuides: lamelGuides || []
      });
    })
    .catch(function (err) {
      console.error(err);
      res.send({ status: false });
    });
}



module.exports = router;
