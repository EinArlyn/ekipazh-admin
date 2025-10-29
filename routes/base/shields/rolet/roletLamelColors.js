var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.roletLamelColors);
router.get('/table/getRows', isAuthenticated, getRows);
router.post('/table/updateRow', isAuthenticated, updateRow);
// router.get('/lamel/getLamel/:id', isAuthenticated, getLamel);
// router.get('/lamel/getGuides', isAuthenticated, getGuides);
// router.get('/lamel/getEndLists', isAuthenticated, getEndLists);
// router.post('/lamel/add', isAuthenticated, rolet.addNewLamel);
// router.post('/lamel/edit', isAuthenticated, rolet.editLamel);
// router.post('/lamel/delete', isAuthenticated, rolet.deleteLamel);

// router.post('/lamel/active/:id', isAuthenticated, activeLamel);
// router.get('/lamel/getEditLamelInfo/:id', isAuthenticated, getEditLamelInfo);


function getRows(req, res) {
    models.rol_lamel_color_groups.findAll().then(function(rows) {
        res.send(rows);
    })
}

function updateRow(req, res) {
    const lamelId     = parseInt(req.body.lamelId, 10);
    const colorId     = parseInt(req.body.colorId, 10);
    const newGroupId    = parseInt(req.body.newGroupId, 10);

    models.rol_lamel_color_groups.findOne({
        where: {rol_lamel_id: lamelId, rol_color_id: colorId}
    }).then(function(row) {
        if (row) {
            return row.updateAttributes({
                rol_color_group_id: newGroupId
            }).then(function () {
                res.send({ status: true, mode: 'updated' });
            });
        } else {
            return models.rol_lamel_color_groups.create({
                rol_lamel_id: lamelId,
                rol_color_id: colorId, 
                rol_color_group_id: newGroupId
            }).then(function () {
                res.send({ status: true, mode: 'created' });
            });
        }
    })
}


module.exports = router;
