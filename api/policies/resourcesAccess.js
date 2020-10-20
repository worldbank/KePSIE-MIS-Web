/**
 * Resources Access
 *
 * @module      :: Policy
 * @description :: just to check if user is admin or not
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

var userRole=['B&Cs - ITEG','B&Cs - Licensing decision-makers',
  'B&Cs - Other B&Cs members','High-level - KTF, WB','Steering Committee','Logistics Firm'];

  if (userRole.indexOf(req.session.loggedInUser.role)==-1) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.view('403', {layout: null});
};