var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.addElements);
router.get('/getAddElem/:id', isAuthenticated, getAddElem);
router.post('/addElem/active/:id', isAuthenticated, activeAddElem);
router.post('/addElement', isAuthenticated, rolet.addAddElements);
router.post('/edit', isAuthenticated, rolet.editAddElements);
router.post('/delete', isAuthenticated, rolet.deleteAddElements);

function activeAddElem(req, res) {
    models.rol_add_elements.findOne({
        where: {id: req.params.id}
    }).then(function(addElem) {
        if (addElem){
            addElem.updateAttributes({
                is_activ: addElem.is_activ ? 0 : 1 
            })
            res.send({status: true});
        } else {
            res.send({status: false});
        }
    })
}

function getAddElem(req,res) {
    models.rol_add_elements.findOne({
        where: {id: req.params.id}
    }).then(function(addElem) {
        if (addElem) {
            res.send({status: true, addElem: addElem});
        } else {
            res.send({status: false});
        }
    }).catch(function(err){
        res.send({status: false});
    })
}

module.exports = router;
