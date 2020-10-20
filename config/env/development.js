/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }

    port: process.env.PORT || 1337,
    hostname: "http://52.66.42.20/",
    assetURL: "http://52.66.42.20:1337",
    routesPrefix: "http://52.66.42.20:1337",
    mongoURL: 'mongodb://localhost:27017/kepsie',
    logoURL: "http://52.66.42.20:1337/static/images/moh_logo.png",


};
