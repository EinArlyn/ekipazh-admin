var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.controls);
router.get('/getControl/:id', isAuthenticated, getControl);
router.post('/add', isAuthenticated, rolet.addNewControl);
router.post('/edit', isAuthenticated, rolet.editControl);
router.post('/delete', isAuthenticated, rolet.deleteControl);

router.get('/getGroups', isAuthenticated, getGroups);
router.get('/getGroup/:id', isAuthenticated, getGroup);

router.post('/addGroup', isAuthenticated, rolet.addNewGroupControls);
router.post('/editGroup', isAuthenticated, rolet.editGroupControls);
router.post('/deleteGroup', isAuthenticated, rolet.deleteGroupControls);

router.post('/active/:id', isAuthenticated, activeControl);
router.post('/activeGr/:id', isAuthenticated, activeGr);
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

function activeGr(req, res) {
    models.rol_control_groups.findOne({
        where: {id: req.params.id}
    }).then(function(group) {
        group.updateAttributes({
            is_activ: group.is_activ ? 0 : 1
        })
        res.send({status: true});
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

function getGroups(req,res) {
    models.rol_control_groups.findAll({}).then(function(groups) {
        res.send({status: true, groups: groups});
    })
}

function getGroup(req, res) {
    const groupId = parseInt(req.params.id, 10);
    if (!Number.isFinite(groupId)) return res.send({ status: false, error: 'bad id' });

    models.rol_control_groups.findOne({ where: { id: groupId } })
    .then(function (group) {
        if (!group) return res.send({ status: false, error: 'not found' });
        res.send({ status: true, group: group});
    })
    .catch(function (err) {
        console.error('getGroup error:', err);
        res.send({ status: false });
    });
}



module.exports = router;
