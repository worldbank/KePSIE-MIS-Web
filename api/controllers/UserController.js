/**
 * UserController
 * 
 * @description :: Server-side logic for User Management
 * @author : Jay Pastagia
 */

var passport = require('passport');
var util = require('util');
var fs = require('fs');
var CryptoJS = require('crypto-js');
var path = require('path');
var unzip = require('unzip');

module.exports = {

    usermanagement: function(req, res) {
        res.view('user/all');
    },
    addUser: function(req, res) {
        res.view('user/add');
    },
    auditLogs: function(req, res) {
        res.view('user/auditLogs');
    },
    index: function(req, res) {
        res.view('login', { layout: null });
    },

    login: function(req, res) {
        if (req.session.loggedInUser) {
            res.redirect(sails.config.routesPrefix + '/dashboard');
        } else {
            res.view('login', { layout: null });
        }
    },

    sendEmail: function(req, res) {


        sails.log("In sendEmail function");
        var receiver = req.body.email;

        User.findOne({ where: { 'email': receiver, 'is_deleted': "false" } }).exec(function(err, model) {

            if (model != undefined) {
                if (model.email == receiver) {

                    res.json({ status: 'Email found' });
                    var id = model.id;

                    var ciphertext = CryptoJS.AES.encrypt(model.id, 'secret key 123');

                    model.encryptedString = ciphertext.toString();
                    model.save(function(err) {

                    });

                    EmailService.crudMail(receiver, "reset password", null, null, null, ciphertext);


                } else {
                    req.flash('emailReply', 'Your email is not registered');
                    res.json({ status: 'Email not found' });
                }
            } else {
                res.json({ status: 'Email not found' });

            }
        });
    },

    authenticate: function(req, res, next) {

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {

                req.session.flash = {
                    err: " Wrong Username Password"
                }
                var a = {
                    "Auth": [
                        { "valid": "No" }
                    ]
                };

                return res.json(a);
            }
            req.logIn(user, function(err) {

                var b = {
                    "Auth": [
                        { "valid": "Yes" },
                        user
                    ]
                };
                sails.log.info('A user (IP adddress: `%s`) logged in to System...', req.ip);
                req.session.username = user.name;
                req.session.userId = user.id;
                req.session.loggedInUser = user;

                var finalResult = [];
                // fetch the list of pending actions
                var newQueNotifyUser = ['Admin', 'B&Cs - ITEG', 'B&Cs - Licensing decision-makers', 'MOH Coordinator'];

                if (newQueNotifyUser.indexOf(user.role) != -1) {
                    UserService.getPendingActionFAQ(req, function(finalResult) {
                        return res.json(b);
                    });
                } else {
                    return res.json(b);
                }
            });

        })(req, res);

    },
    'list': function(req, res, next) {

        var columns = ["id", "name", "email", "role", "organization", "county"];
        var iDisplayStart = req.query.iDisplayStart;
        var iDisplayLength = req.query.iDisplayLength;

        var showPage = parseInt(iDisplayStart / iDisplayLength) + 1;

        var iSortCol_0 = "";
        var sSortDir_0 = "";
        iSortCol_0 = req.query.iSortCol_0;

        sSortDir_0 = req.query.sSortDir_0;

        var sSearch = req.query.sSearch;
        var sortColumn = "";
        if (columns[iSortCol_0] == "id") {
            sortColumn = "" + "createdAt" + " " + "desc";
        } else {
            var temp = parseInt(iSortCol_0);
            sortColumn = "" + columns[temp] + " " + sSortDir_0;

        }

        if (sSearch != "") {

            User.count({
                where: {
                    'is_deleted': "false",
                    $or: [{
                        'name': {
                            'startsWith': sSearch
                        }
                    }, {
                        'role': {
                            'startsWith': sSearch
                        }
                    }, {
                        'county': {
                            'startsWith': sSearch
                        }
                    }, {
                        'email': {
                            'startsWith': sSearch
                        }
                    }, {
                        'organization': {
                            'startsWith': sSearch
                        }
                    }]
                }
            }).exec(function(err, nos) {
                User.find({
                    where: {
                        'is_deleted': "false",
                        $or: [{
                            'name': {
                                'startsWith': sSearch
                            }
                        }, {
                            'role': {
                                'startsWith': sSearch
                            }
                        }, {
                            'county': {
                                'startsWith': sSearch
                            }
                        }, {
                            'email': {
                                'startsWith': sSearch
                            }
                        }, {
                            'organization': {
                                'startsWith': sSearch
                            }
                        }]
                    }
                }).paginate({
                    page: showPage,
                    limit: iDisplayLength
                }).sort(sortColumn).exec(function(err, users) {
                    res.send({
                        "aaData": users,
                        "iTotalRecords": nos,
                        "iTotalDisplayRecords": nos
                    });
                });
            });
        } else {
            User.count({
                where: {
                    'is_deleted': "false"
                }
            }).exec(function(err, nos) {

                if (iDisplayLength == -1) {
                    showPage = 0;
                    iDisplayLength = nos;
                }

                User.find({ 'is_deleted': "false" }).paginate({ page: showPage, limit: iDisplayLength }).sort(sortColumn).exec(function foundUsers(err, users) {

                    res.send({ "aaData": users, "iTotalRecords": nos, "iTotalDisplayRecords": nos });
                });
            });
        }

    },

    'auditTrail': function(req, res, next) {

        var columns = ["id", "username", "action", "date", "ipAddress"];
        var iDisplayStart = req.query.iDisplayStart;
        var iDisplayLength = req.query.iDisplayLength;
        var showPage = parseInt(iDisplayStart / iDisplayLength) + 1;
        var iSortCol_0 = req.query.iSortCol_0;
        var sSortDir_0 = req.query.sSortDir_0;
        var sSearch = req.query.sSearch;
        var sortColumn = "";
        if (columns[iSortCol_0] == "id") {
            sortColumn = "" + "createdAt" + " " + "desc";
        } else {
            var sortColumn = "" + columns[iSortCol_0] + " " + sSortDir_0;
        }

        if (sSearch != "") {

            AuditLogs.count({
                where: {
                    $or: [{
                            'username': {
                                'startsWith': sSearch
                            }
                        },
                        {
                            'action': {
                                'startsWith': sSearch
                            }
                        },
                        {
                            'date': {
                                'startsWith': sSearch
                            }
                        },
                        {
                            'ipAddress': {
                                'startsWith': sSearch
                            }
                        }
                    ]
                }
            }).exec(function(err, nos) {


                AuditLogs.find({
                    where: {
                        $or: [{
                                'username': {
                                    'startsWith': sSearch
                                }
                            },
                            {
                                'action': {
                                    'startsWith': sSearch
                                }
                            },
                            {
                                'date': {
                                    'startsWith': sSearch
                                }
                            },
                            {
                                'ipAddress': {
                                    'startsWith': sSearch
                                }
                            }
                        ]
                    }
                }).paginate({
                    page: showPage,
                    limit: iDisplayLength
                }).sort(sortColumn).exec(function(err, users) {
                    res.send({
                        "aaData": users,
                        "iTotalRecords": nos,
                        "iTotalDisplayRecords": nos
                    });
                });
            });
        } else {
            AuditLogs.count({}).exec(function(err, nos) {

                if (iDisplayLength == -1) {
                    showPage = 0;
                    iDisplayLength = nos;
                }

                AuditLogs.find().paginate({ page: showPage, limit: iDisplayLength }).sort(sortColumn).exec(function foundUsers(err, users) {

                    res.send({ "aaData": users, "iTotalRecords": nos, "iTotalDisplayRecords": nos });
                });
            });
        }


    },

    'saveUser': function(req, res, next) {
        var user = req.body;
        var receiver = req.body.email;
        user.createdBy = req.session.loggedInUser.name;
        user.modifiedBy = req.session.loggedInUser.name;

        var generator = require('random-password-generator');
        var randomPassword = generator.generate();
        user.password = randomPassword;
        // user.password=12345;
        var randomPassword = user.password;
        var loginurl = sails.config.routesPrefix;
        console.log(user);
        if (user.contactno == '') {
            delete user.contactno;
        }
        if (user.inspectorId == "  ") {
            delete user.inspectorId;
        }
        if (user.county == "  ") {
            delete user.county;
        }
        if (user.otherOrganization == "  ") {
            delete user.otherOrganization;
        }

        User.create(user, function userCreated(err, user) {
            if (err) {
                return res.json(user);
            } else {
                EmailService.crudMail(receiver, "added", loginurl, req.body, randomPassword, null);

                req.flash('userAddedMessage', 'User added successfully');
                return res.json(user);
            }
        });
    },
    'updateUser': function(req, res, next) {
        var user = req.body;
        var receiver = req.body.email;
        var loginurl = sails.config.routesPrefix;
        user.modifiedBy = req.session.loggedInUser.name;
        var userId = user.id;

        if (req.session.loggedInUser.email == user.email) {

            req.session.loggedInUser.path = user.path;
            req.session.loggedInUser.filename = user.filename;

        }

        if (user.contactno == '') {
            user.contactno = null;
        }
        if (user.inspectorId == "  ") {
            user.inspectorId = null;
        }
        if (user.county == "  ") {
            user.county = null;
        }
        if (user.otherOrganization == "  ") {
            user.otherOrganization = null;
        }


        UserService.updateUser(userId, user, sendResponse);

        function sendResponse(user) {
            console.log("updated User: ");

            if (req.session.loggedInUser.id == user[0].id) {
                req.session.loggedInUser = user[0];
            }
            EmailService.crudMail(receiver, "updated", loginurl, req.body, null, null);

            req.flash('userUpdatedMessage', 'User updated successfully');
            return res.json(user);
        }
    },

    'updateProfilePic': function(req, res, next) {
        var user = req.body;
        user.modifiedBy = req.session.loggedInUser.name;
        var userId = user.id;

        UserService.updateUser(userId, user, sendResponse);

        function sendResponse(user) {

            req.session.loggedInUser.path = req.body.path;

            return res.json(user);


        }

    },


    'updatePassword': function(req, res, next) {
        var user = req.body;
        var userId = user.id;

        UserService.updateUser(userId, user, sendResponse);

        function sendResponse(user) {


            return res.json(user);

        }

    },
    changePassword: function(req, res, next) {
        var eid = req.param('id');
        var id = eid.replace(/ /g, "+");

        var bytes = CryptoJS.AES.decrypt(id, 'secret key 123');
        var did = bytes.toString(CryptoJS.enc.Utf8);

        User.findOne(did).exec(function(err, user) {

            return res.view('changePassword', { layout: null, usr: user });

        });

    },
    'incUpdatePassword': function(req, res, next) {
        var updateuser = req.body;

        var bytes = CryptoJS.AES.decrypt(updateuser.id, 'secret key 123');
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);

        updateuser.id = plaintext;


        User.findOne(updateuser.id).exec(function(err, user) {
            if (user.encryptedString && (user.encryptedString != " ")) {
                user.password = updateuser.password;
                user.encryptedString = " ";
                user.save(function(err) {
                    if (err) {
                        res.send("Error");
                    } else {
                        return res.json(user);
                    }
                });
            } else {
                res.json({ msg: "resetPassword" });
            }
        });

    },
    delete: function(req, res) {
        var loginuser = req.body;
        var userId = req.body.id;
        var receiver = req.body.username;
        var loginurl = sails.config.routesPrefix;
        User.findOne(userId).exec(function(err, user) {
            user.is_deleted = "true";
            user.save(function(err) {
                if (err) {
                    res.send("Error");
                } else {

                    EmailService.crudMail(receiver, "deleted", loginurl, user, null, null);
                    req.flash('userDeletedMessage', 'User deleted successfully');
                    return res.json(user);
                }
            });
        });
    },

    view: function(req, res) {
        console.log("in view");
        res.view('');
    },

    profile: function(req, res) {
        res.view('')
    },

    viewdata: function(req, res) {
        var userId = req.body.id;
        User.findOne(userId).exec(function(err, user) {
            return res.json(user);

        });
    },
    viewlog: function(req, res) {
        var logId = req.body.id;
        AuditLogs.findOne(logId).exec(function(err, user) {
            return res.json(user);

        });
    },
    edit: function(req, res) {
        res.view('');

    },
    editdata: function(req, res) {

        var userId = req.body.id;
        User.findOne(userId).exec(function(err, user) {

            return res.json(user);
        });
    },

    upload: function(req, res) {



        req.file('file').upload({
            dirname: require('path').resolve(sails.config.appPath, './assets/upload')
        }, function(err, uploadedFiles) {

            if (err) return res.negotiate(err);

            var filename = path.basename(uploadedFiles[0].fd);

            var filedir = uploadedFiles[0].fd;

            var fn = filedir.replace("assets", ".tmp/public");

            var uploadLocation = filedir;
            var tempLocation = fn;

            fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));

            // fs.createReadStream(sails.config.appPath+'/assets/upload/'+filename).pipe(unzip.Extract({
            // path: 'assets/upload' }));

            return res.json({
                path: filename,
                filename: uploadedFiles[0].filename

            });
        });

    },
    checkEmail: function(req, res) {

        User.findOne({ email: req.body.email, 'is_deleted': "false" }).exec(function(err, user) {

            return res.json(user);
        });
    },
    logout: function(req, res) {
        req.session.authenticated = false;
        req.session.destroy();
        req.logout();
        res.redirect(sails.config.routesPrefix + '/login');
    }
}