module.exports = function(req, res) {
  res.render('apiInfo', {
    title      : 'API',
    cssSrcs    : ['/assets/stylesheets/api.css'],
    scriptSrcs : ['/assets/javascripts/api.js']
  });
};
