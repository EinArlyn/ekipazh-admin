var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.roletPrice);
router.get('/getPrices', isAuthenticated, getPrices);
router.post('/changePrice', isAuthenticated, changePrice);

function getPrices(req, res) {
    models.rol_prices.findAll({}).then(function(prices){
        res.send({status: true, prices: prices});
    })
}
function changePrice(req, res) {
  const lamId = parseInt(req.body.lamId, 10);
  const boxId = parseInt(req.body.boxId, 10);
  const newPrice = Number(req.body.price); 

  if (!Number.isFinite(lamId) || !Number.isFinite(boxId) || !Number.isFinite(newPrice)) {
    return res.send({ status: false, error: 'bad params' });
  }

  models.rol_prices.findOne({
    where: { rol_lamel_id: lamId, id_rol_box: boxId }
  })
  .then(row => {
    if (row) {

      return row.update({ price: newPrice })
        .then(() => res.send({ status: true, mode: 'updated' }));
    }

    return models.rol_prices.create({
      rol_lamel_id: lamId,
      id_rol_box: boxId,
      price: newPrice
    })
    .then(() => res.send({ status: true, mode: 'created' }));
  })
  .catch(err => {
    console.error('changePrice error:', err);
    res.send({ status: false });
  });
}



module.exports = router;
