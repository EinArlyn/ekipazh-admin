var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.index);
router.get('/group/getGroups', isAuthenticated, getGroups);
router.get('/group/getGroup/:id', isAuthenticated, getGroup);
router.post('/', isAuthenticated, rolet.addNewGroupSystem);
router.post('/group/edit', isAuthenticated, rolet.editGroupSystem);
router.post('/group/delete', isAuthenticated, rolet.deleteGroupSystem);
router.post('/system/add', isAuthenticated, rolet.addNewSystem);
router.post('/system/edit', isAuthenticated, rolet.editSystem);
router.post('/system/delete', isAuthenticated, rolet.deleteSystem);

router.post('/group/active/:id', isAuthenticated, activeGroup);
router.post('/system/active/:id', isAuthenticated, activeSystem);
router.get('/system/getSystem/:id', isAuthenticated, getSystem);


function activeSystem(req, res) {
    models.rol_boxes.findOne({
        where: {id: req.params.id}
    }).then(function(system) {
        system.updateAttributes({
            is_activ: system.is_activ ? 0 : 1
        })
        res.send({status: true});
    })
}

function activeGroup(req, res) {
    models.rol_groups.findOne({
        where: {id: req.params.id}
    }).then(function(group) {
        group.updateAttributes({
            is_activ: group.is_activ ? 0 : 1
        })
        res.send({status: true});
    })
}


function getSystem(req,res) {
    const box_id = req.params.id;
    models.rol_boxes.findOne({
        where: {id: box_id}
    }).then(function(box) {
        models.rol_box_sizes.findAll({
            where: {id_rol_box: box_id}
        }).then(function(sizes) {
            models.rol_box_prices.findOne({
                where: {id_rol_box: req.params.id}
            }).then(function(split_price){
                sizes.sort((a,b) => a.height - b.height);
                res.send({status: true, box: box, sizes: sizes, prices: split_price || 0});
            }).catch(function(err){
                res.send({status: false});
            })
        }).catch(function(err){
            res.send({status: false});
        })
    }).catch(function(err){
        res.send({status: false});
    })
}
function getGroup(req, res) {
    const groupId = parseInt(req.params.id, 10);
    if (!Number.isFinite(groupId)) return res.send({ status: false, error: 'bad id' });

    models.rol_groups.findOne({ where: { id: groupId } })
    .then(function (group) {
        if (!group) return res.send({ status: false, error: 'not found' });
        return models.compliance_rol_groups.findAll({ where: { rol_group_id: groupId } })
        .then(function (countries) {
            let country_ids = [];
            if (countries) {
                country_ids = countries.map(c => c.country_id);
            }
            res.send({ status: true, group: group, country_ids: country_ids });
        });
    })
    .catch(function (err) {
        console.error('getGroup error:', err);
        res.send({ status: false });
    });
}

function getGroups(req,res) {
    models.rol_groups.findAll({}).then(function(groups) {
        res.send({status: true, groups: groups});
    })
}


module.exports = router;
