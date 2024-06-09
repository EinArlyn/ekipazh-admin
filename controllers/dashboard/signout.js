module.exports = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};
