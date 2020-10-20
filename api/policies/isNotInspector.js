/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: just to check if user is admin or not
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.loggedInUser.role!="Inspector") {
    return next();
   
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
   return res.view("403");
};