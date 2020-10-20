/**
 * isLoggedIn
 *
 * @module      :: Policy
 * @description :: just to check if user is logged in or not
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.loggedInUser) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.redirect(sails.config.routesPrefix+'/login');
};