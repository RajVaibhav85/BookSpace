// function ensureAuthenticated(req, res, next) {
//   if (req && req.session && req.session.userId) {
//     return next();
//   }
//   // Not authenticated - redirect to login page
  
//   return res.redirect('/login');
// }



function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  // If request is from fetch/AJAX
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(401).json({ redirect: '/login' });
  }

  // Normal browser request
  return res.redirect('/login');
}

module.exports = { ensureAuthenticated };