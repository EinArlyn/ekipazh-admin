var router = require('express').Router();
var rolet = require('../../../../controllers/shields/rolet');
var models = require('../../../../lib/models');
var isAuthenticated = require('../../../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, rolet.guidePriceColor);
router.get('/getPrices', isAuthenticated, getPrices);
router.post('/changePrice', isAuthenticated, changePrice);
router.post('/globalChangeRules', isAuthenticated, globalChangeRules);

function getPrices(req, res) {
    models.rol_guide_prices.findAll({}).then(function(prices){
        res.send({status: true, prices: prices});
    })
}
function changePrice(req, res) {
  const groupColorId = parseInt(req.body.groupColorId, 10);
  const guideId = parseInt(req.body.guideId, 10);
  const newPrice = Number(req.body.price); 
  const rules = parseInt(req.body.rules, 10);
  const priceType = parseInt(req.body.priceType, 10);

  if (!Number.isFinite(groupColorId) || !Number.isFinite(guideId) || !Number.isFinite(newPrice) || !Number.isFinite(rules)) {
    return res.send({ status: false, error: 'bad params' });
  }

  models.rol_guide_prices.findOne({
    where: { rol_guide_id: guideId, rol_color_group_id: groupColorId }
  })
  .then(row => {
    if (row) {
      const updateData = { rol_price_rules_id: rules };
      
      if (priceType === 0) {
        updateData.price = newPrice;
      } else if (priceType === 1) {
        updateData.price_m = newPrice;
      }

      return row.update(updateData)
        .then(() => res.send({ status: true, mode: 'updated' }));
    }

    const createData = {
      rol_guide_id: guideId,
      rol_color_group_id: groupColorId,
      rol_price_rules_id: rules
    };

    if (priceType === 0) {
      createData.price = newPrice;
    } else if (priceType === 1) {
      createData.price_m = newPrice;
    }

    return models.rol_guide_prices.create(createData)
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
    models.rol_guide_prices.update(
      { rol_price_rules_id: rules },
      { where: { rol_guide_id: v.guideId, rol_color_group_id: v.groupColorId } }
    )
  ))
  .then(() => res.send({ status: true }))
  .catch((e) => {
    console.error('globalChangeRules error:', e);
    res.send({ status: false });
  });
}



module.exports = router;
