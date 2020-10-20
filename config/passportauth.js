var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id,'is_deleted': "false" } , function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
 
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log("username & pass" + username + " -- "+password);
    User.findOne({ email : username,'is_deleted': "false" }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect User.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          console.log("errrrr -- "+err);
          console.log(res);
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });

          var returnUser = {
            name: user.name,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, user, {
            message: 'Logged In Successfully'
          });
        });
    });
  }
));
