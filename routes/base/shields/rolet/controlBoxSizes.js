var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.controlBoxSizes);
router.get('/getLinks', isAuthenticated, getLinks);
router.post('/changeLinks', isAuthenticated, changeLinks);

function getLinks(req, res) {
  models.rol_controls_box_sizes.findAll({
  })
  .then(function(links) {
    res.send({ status: true, links: links });
  })
  .catch(function(err) {
    console.error(err);
    res.send({ status: false, links: [] });
  });
}


function changeLinks(req, res) {
  const status    = parseInt(req.body.status, 10);
  const controlId = parseInt(req.body.controlId, 10);
  const boxSizeId = parseInt(req.body.boxSizeId, 10);

  if (!controlId || !boxSizeId || (status !== 0 && status !== 1)) {
    console.error('Bad params', req.body);
    return res.send({ status: false });
  }

  models.rol_controls_box_sizes.findOne({
    where: {
      rol_control_id: controlId,
      rol_box_size_id: boxSizeId
    }
  })
  .then(function(link) {
    // нужно удалить связь
    if (link && status === 0) {
      return link.destroy().then(function() {
        res.send({ status: true });
      });
    }

    // нужно создать связь
    if (!link && status === 1) {
      return models.rol_controls_box_sizes.create({
        rol_control_id: controlId,
        rol_box_size_id: boxSizeId
      }).then(function() {
        res.send({ status: true });
      });
    }

    // состояние не меняется (кликнули, но по факту и так такое значение)
    res.send({ status: true });
  })
  .catch(function(err) {
    console.error(err);
    res.send({ status: false });
  });
}



module.exports = router;
