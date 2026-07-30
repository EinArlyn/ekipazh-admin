var models = require('../../../lib/models/index.js');
var parseForm = require('../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../lib/services/imageLoader.js').loadImage;


module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>Edit system');
    console.log(fields);

    var systemId = parseInt(fields.system_id, 10);
    if (!systemId) {
      return res.send({ status: false, error: 'system_id required' });
    }

    var profileLinks = [];
    var ptProfileLinks = [];
    var widthsList = [];

    if (fields.profile_links) {
      try {
        profileLinks = JSON.parse(fields.profile_links);
      } catch (e) {
        console.error('Error parsing profile_links:', e);
      }
    }

    if (fields.pt_profile_links) {
      try {
        ptProfileLinks = JSON.parse(fields.pt_profile_links);
      } catch (e) {
        console.error('Error parsing pt_profile_links:', e);
      }
    }

    if (fields.widths_list) {
      try {
        widthsList = JSON.parse(fields.widths_list);
      } catch (e) {
        console.error('Error parsing widths_list:', e);
      }
    }

    models.muntins
      .findOne({
        where: { id: systemId },
      })
      .then(function (system) {
        if (!system) {
          return res.send({ status: false });
        }

        return system
          .updateAttributes({
            name: fields.name,
            position: parseInt(fields.position, 10) || 0,
            min_gap: Number(fields.min_gap) || 0,
            price: Number(fields.price) || 0,
            currency_id: parseInt(fields.currency_id, 10) || 0,
            description: fields.description,
          })
          .then(function () {
            var linkOps = [];

            return models.muntins_profile_links
              .findAll({
                where: { muntins_id: systemId },
              })
              .then(function (existingProfileLinks) {
                var incomingProfileIds = profileLinks
                  .map(function (profileId) {
                    return parseInt(profileId, 10);
                  })
                  .filter(function (profileId) {
                    return profileId;
                  });

                existingProfileLinks.forEach(function (row) {
                  if (!incomingProfileIds.includes(Number(row.profile_id))) {
                    linkOps.push(row.destroy());
                  }
                });

                incomingProfileIds.forEach(function (profileId) {
                  var exists = existingProfileLinks.some(function (row) {
                    return Number(row.profile_id) === Number(profileId);
                  });

                  if (!exists) {
                    linkOps.push(
                      models.muntins_profile_links.create({
                        muntins_id: systemId,
                        profile_id: profileId,
                      })
                    );
                  }
                });
              })
              .then(function () {
                return models.muntins_pt_profile_links.findAll({
                  where: { muntins_id: systemId },
                });
              })
              .then(function (existingPtProfileLinks) {
                var incomingPtProfileIds = ptProfileLinks
                  .map(function (ptProfileId) {
                    return parseInt(ptProfileId, 10);
                  })
                  .filter(function (ptProfileId) {
                    return ptProfileId;
                  });

                existingPtProfileLinks.forEach(function (row) {
                  if (!incomingPtProfileIds.includes(Number(row.pt_profile_id))) {
                    linkOps.push(row.destroy());
                  }
                });

                incomingPtProfileIds.forEach(function (ptProfileId) {
                  var exists = existingPtProfileLinks.some(function (row) {
                    return Number(row.pt_profile_id) === Number(ptProfileId);
                  });

                  if (!exists) {
                    linkOps.push(
                      models.muntins_pt_profile_links.create({
                        muntins_id: systemId,
                        pt_profile_id: ptProfileId,
                      })
                    );
                  }
                });
              })
              .then(function () {
                return Promise.all(linkOps);
              });
          })
          .then(function () {
            return models.muntins_widths.findAll({
              where: { muntins_id: systemId },
            });
          })
          .then(function (existingWidths) {
            var widthsOps = [];

            widthsList.forEach(function (item) {
              var widthId = item && item.id ? parseInt(item.id, 10) : 0;
              var widthValue = item ? item.width : '';
              var priceValue = item ? item.price : '';
              var hasWidth = String(widthValue || '').trim() !== '';

              if (widthId) {
                var existingRow = existingWidths.find(function (row) {
                  return Number(row.id) === Number(widthId);
                });

                if (!existingRow) {
                  return;
                }

                if (hasWidth) {
                  widthsOps.push(
                    existingRow.updateAttributes({
                      width: Number(widthValue) || 0,
                      price: Number(priceValue) || 0,
                    })
                  );
                } else {
                  widthsOps.push(existingRow.destroy());
                }

                return;
              }

              if (hasWidth) {
                widthsOps.push(
                  models.muntins_widths.create({
                    muntins_id: systemId,
                    width: Number(widthValue) || 0,
                    price: Number(priceValue) || 0,
                  })
                );
              }
            });

            return Promise.all(widthsOps);
          })
          .then(function () {
            if (!(files && files.muntins_img && files.muntins_img.name)) {
              return;
            }

            const imageUrl =
              '/local_storage/muntins/' +
              Math.floor(Math.random() * 1000000) +
              files.muntins_img.name;

            const maybePromise = loadImage(files.muntins_img.path, imageUrl);
            const waitLoad =
              maybePromise && typeof maybePromise.then === 'function'
                ? maybePromise
                : Promise.resolve();

            return waitLoad.then(function () {
              return system.updateAttributes({ img: imageUrl });
            });
          });
      })
      .then(function () {
        res.send({ status: true });
      })
      .catch(function (error) {
        console.error('Edit muntins error:', error);
        res.send({ status: false });
      });
  });
};


