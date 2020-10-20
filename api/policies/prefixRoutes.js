/**
 * prefixRoutes
 *
 * @module      :: Policy
 * @description :: just to add prefix for routes
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  console.log("sails.config.routesPrefix : "+sails.config.routesPrefix);
  req.url = sails.config.routesPrefix + req.url;
  return next();
};