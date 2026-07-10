var router = require('express').Router();
var grids = require('../../../../controllers/shields/grids');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, grids.colorPrices);
router.get('/getPrices', isAuthenticated, getPrices);
router.post('/changePrice', isAuthenticated, changePrice);

function getPrices(req, res) {
    models.pls_system_colors_prices.findAll({}).then(function(prices){
        res.send({status: true, prices: prices});
    })
}

function changePrice(req, res) {
  const colorGroupId = parseInt(req.body.colorGroupId, 10);
  const systemId = parseInt(req.body.systemId, 10);
  const newPrice = Number(req.body.value); 

  if (!Number.isFinite(colorGroupId) || !Number.isFinite(systemId) || !Number.isFinite(newPrice)) {
    return res.send({ status: false, error: 'bad params' });
  }

  models.pls_system_colors_prices.findOne({
    where: { color_group_id: colorGroupId, system_id: systemId }
  })
  .then(row => {
    if (row) {

      return row.update({ value: newPrice })
        .then(() => res.send({ status: true, mode: 'updated' }));
    }

    return models.pls_system_colors_prices.create({
      color_group_id: colorGroupId,
      system_id: systemId,
      value: newPrice
    })
    .then(() => res.send({ status: true, mode: 'created' }));
  })
  .catch(err => {
    console.error('changePrice error:', err);
    res.send({ status: false });
  });
}



module.exports = router;
