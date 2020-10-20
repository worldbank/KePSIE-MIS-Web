  /**
 * AskExpert.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	 board: {
            type: 'array'
        },
         otherBoard: {
            type: 'string'
        },
        status:{
          type:'string'
        },
       
        section: {
            type: 'string'
        },
        otherSection: {
            type: 'string'
        },

        sub_section: {
            type: 'string'
        },
        othersub_section: {
            type: 'string'
        },

         sub_sub_section: {
            type: 'string'
        },
        othersub_sub_section: {
            type: 'string'
        },
        query: {
            type: 'string'
        },
        response:{
          type:'array'
        },
        is_deleted:{
          type:'boolean',
           defaultsTo: false
        }    
  }
};

