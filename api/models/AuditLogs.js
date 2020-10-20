/**
 * AuditLogs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  
        ipAddress: {
            type: 'string'
        },
       
        url: {
            type: 'string'
        },

        action: {
            type: 'string'
        },

         body: {
            type: 'string'
        },

          username: {
            type: 'string'
        },

         userid: {
            type: 'string'
        },

         query: {
            type: 'string'
        },
        
        date: {
            type: 'string'
        }

  }
};

