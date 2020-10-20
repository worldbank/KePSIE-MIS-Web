/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


var bcrypt = require('bcryptjs');

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            email: true,
            required: true,
        },
        contactno: {
            type: 'string'
        },
         designation: {
            type: 'string'
        },
          role: {
            type: 'string',
            required: true
        },
         county: {
            type: 'string',   
        },
         organization: {
            type: 'string',
            required: true
        },
        otherOrganization: {
            type: 'string'
        },
        inspectorId: {
            type: 'string'
        },
        password: {
            type: 'string'
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
            type: 'string',
             required: true
        },
        encryptedString:{
            type: 'string'
        },
         groupId:{
            type: 'array'
        },
         groupName:{
            type: 'array'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            delete obj._csrf;
            return obj;
        }
    },

    beforeCreate: function (user, cb) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    },

 beforeUpdate: function (user, cb) {
    if(user.password){
   
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }else{
     cb();
    }
    } 


};

