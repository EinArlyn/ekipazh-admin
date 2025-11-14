var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.controls);
router.get('/getControl/:id', isAuthenticated, getControl);
router.post('/add', isAuthenticated, rolet.addNewControl);
router.post('/edit', isAuthenticated, rolet.editControl);
router.post('/delete', isAuthenticated, rolet.deleteControl);

router.post('/active/:id', isAuthenticated, activeControl);
router.post('/isStandart/:id', isAuthenticated, standartControl);

function activeControl(req, res) {
    console.log('control>>',req.params);
    models.rol_controls.findOne({
        where: {id: req.params.id}
    }).then(function(control) {
        if (control){
            control.updateAttributes({
                is_activ: control.is_activ ? 0 : 1 
            })
            res.send({status: true});
        } else {
            res.send({status: false});
        }
    })
}

function standartControl(req, res) {
  console.log('control>>', req.params);

  models.rol_controls.findAll({
    where: { factory_id: req.session.user.factory_id }
  })
  .then(function(controls) {

    if (!controls || controls.length === 0) {
        return res.send({ status: false });
    }

    const promises = controls.map(function(c) {
        let newValue = 0;
        if (c.id !== Number(req.params.id)) {
            newValue = 0;
        } else {
            newValue = 1;
        }
        return c.updateAttributes({ is_standart: newValue });
    });

    return Promise.all(promises);
  })
  .then(function() {
    res.send({ status: true });
  })
  .catch(function(err) {
    console.error(err);
    res.send({ status: false });
  });
}



function getControl(req,res) {
    models.rol_controls.findOne({
        where: {id: req.params.id}
    }).then(function(control) {
        if (control) {
            res.send({status: true, control: control});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}




module.exports = router;
