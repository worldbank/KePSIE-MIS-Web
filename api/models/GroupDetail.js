/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	 name: {
            type: 'string',
            required: true
        },
         purpose: {
            type: 'array'
        },
         no_of_members: {
            type: 'integer'
        },
        memberList:{
          type:'string'
        },
       
       createdAt: {
            type: 'string',
              required: true
        },
         modifiedAt: {
            type: 'string',
             required: true
        },
         createdBy: {
            type: 'string',
             required: true
        },
         modifiedBy: {
            type: 'string',
             required: true
        },
         is_deleted:{
            type: 'string'
        },
    }

};

