var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.roletBoxHeight);
router.get('/getBoxHeight', isAuthenticated, getBoxHeight);
router.post('/changeHeight', isAuthenticated, changeHeight);

function getBoxHeight(req, res) {
    models.rol_box_lamel_heights.findAll({}).then(function(heights){
        res.send({status: true, heights: heights});
    })
}
function changeHeight(req, res) {
  var lamId     = parseInt(req.body.lamId, 10);
  var boxId     = parseInt(req.body.boxId, 10);
  var sizeId    = parseInt(req.body.sizeId, 10);
  var newHeight = Number(req.body.height);
  var isGrid    = Number(req.body.isGrid) === 1 ? 1 : 0;

  if (!(isFinite(lamId) && isFinite(boxId) && isFinite(sizeId) && isFinite(newHeight))) {
    return res.send({ status: false, error: 'bad params' });
  }

  models.rol_box_lamel_heights.findOne({
    where: { rol_lamel_id: lamId, id_rol_box: boxId, rol_box_size_id: sizeId }
  })
  .then(function (row) {
    var data = {};
    if (isGrid === 1) data.height_is_grid = newHeight;
    else data.height_not_grid = newHeight;

    if (row) {
      return row.update(data).then(function () {
        res.send({ status: true, mode: 'updated' });
      });
    }

    // создаём новую запись
    var payload = {
      rol_lamel_id: lamId,
      id_rol_box: boxId,
      rol_box_size_id: sizeId
    };
    if (isGrid === 1) payload.height_is_grid = newHeight;
    else payload.height_not_grid = newHeight;

    return models.rol_box_lamel_heights.create(payload).then(function () {
      res.send({ status: true, mode: 'created' });
    });
  })
  .catch(function (err) {
    console.error('changeHeight error:', err);
    try { res.send({ status: false, error: 'db' }); } catch (e) {}
  });
}




module.exports = router;
