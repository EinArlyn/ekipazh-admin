var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.templates);
router.post('/addTemplate', isAuthenticated, grids.addTemplate);
router.post('/editTemplate', isAuthenticated, grids.editTemplate);
router.post('/deleteTemplate', isAuthenticated, grids.deleteTemplate);
router.get('/getTemplate/:id', isAuthenticated, getTemplate);
router.get('/getSystems', isAuthenticated, getSystems);
router.post('/active/:id', isAuthenticated, activeTemplate);

function activeTemplate(req, res) {
    models.pls_templates.findOne({
        where: {id: req.params.id}
    }).then(function(template) {
        template.updateAttributes({
            is_active: template.is_active ? 0 : 1
        })
        res.send({status: true});
    })
}

function getSystems(req,res) {
    models.pls_systems.findAll({}).then(function(systems) {
        res.send({status: true, systems: systems});
    });
}


function getTemplate(req,res) {
    models.pls_templates.findOne({
        where: { id: req.params.id }
    }).then(function(template) {
        models.pls_template_system_links.findAll({
            where: { template_id: req.params.id }
        }).then(function(links) {
            res.send({status: true, template: template, links: links});
        });
    });
}




module.exports = router;
