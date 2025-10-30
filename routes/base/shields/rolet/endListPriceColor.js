var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.endListPriceColor);
router.get('/getPrices', isAuthenticated, getPrices);
router.post('/changePrice', isAuthenticated, changePrice);
router.post('/globalChangeRules', isAuthenticated, globalChangeRules);

function getPrices(req, res) {
    models.rol_end_list_prices.findAll({}).then(function(prices){
        res.send({status: true, prices: prices});
    })
}
function changePrice(req, res) {
  const groupColorId = parseInt(req.body.groupColorId, 10);
  const endListId = parseInt(req.body.endListId, 10);
  const newPrice = Number(req.body.price); 
  const rules = parseInt(req.body.rules, 10);

  if (!Number.isFinite(groupColorId) || !Number.isFinite(endListId) || !Number.isFinite(newPrice) || !Number.isFinite(rules)) {
    return res.send({ status: false, error: 'bad params' });
  }

  models.rol_end_list_prices.findOne({
    where: { rol_end_list_id: endListId, rol_color_group_id: groupColorId }
  })
  .then(row => {
    if (row) {

      return row.update({ price: newPrice, rol_price_rules_id: rules })
        .then(() => res.send({ status: true, mode: 'updated' }));
    }

    return models.rol_end_list_prices.create({
      rol_end_list_id: endListId,
      rol_color_group_id: groupColorId,
      price: newPrice,
      rol_price_rules_id: rules
    })
    .then(() => res.send({ status: true, mode: 'created' }));
  })
  .catch(err => {
    console.error('changePrice error:', err);
    res.send({ status: false });
  });
}

function globalChangeRules(req, res) {
  const rules = Number(req.body.rules);
  let values;

  try {
    values = JSON.parse(req.body.values || '[]');
  } catch (e) { 
    return res.send({ status: false, error: 'bad_values' });
  }

  if (!Number.isFinite(rules) || !Array.isArray(values) || values.length === 0) {
    return res.send({ status: true, updated: 0 });
  }

  Promise.all(values.map(v =>
    models.rol_end_list_prices.update(
      { rol_price_rules_id: rules },
      { where: { rol_end_list_id: v.endListId, rol_color_group_id: v.groupColorId } }
    )
  ))
  .then(() => res.send({ status: true }))
  .catch((e) => {
    console.error('globalChangeRules error:', e);
    res.send({ status: false });
  });
}



module.exports = router;
