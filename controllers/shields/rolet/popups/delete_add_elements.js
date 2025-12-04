var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>delete add elem');
    console.log(fields);

    models.rol_add_elements.findOne({
      where: { id: fields.add_element_id }
    })
    .then(function (addElem) {
      if (!addElem) {
        return res.send({ status: false, error: 'not found' });
      }

      return addElem.destroy()
        .then(function () {
          res.send({ status: true });
        });
    })
    .catch(function (err) {
      console.error(err);
      res.send({ status: false });
    });

  });
};
