function ensureAuthenticated(req, res, next) {
  if (req && req.session && req.session.user) {
    return next();
  }
  // Not authenticated - redirect to login page
  
  return res.redirect('/login');
}

module.exports = { ensureAuthenticated };
