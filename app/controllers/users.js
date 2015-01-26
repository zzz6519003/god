
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var Article = mongoose.model('Article');


/**
 * Load
 */

exports.load = function (req, res, next, id) {
  var options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
//    console.log(user)
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

exports.loadName = function(req, res, next, userName) {
  var options = {
    criteria: { username : userName}
  };
  User.load(options, function(err, user) {
    if (err) {
      next(err);

    }
    if (!user) {

      return next(new Error('Failed to load User ' + userName));
    }
    req.profile = user;
    next();

  })
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        error: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      });
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;

//  utils.findByParam(article.comments, { id: id }, function (err, comment) {
//    if (err) return next(err);
//    req.comment = comment;
//    next();
//  });
  console.log(user)
  var articles = Article.find({ user : user._id }, function(err, articles) {console.log(articles[0])})

//  articles = Article.find();
  user.articles = articles;
//  console.log(articles)
//  res.send("haha")
  res.render('users/show', {
    title: user.name,
    user: user
//    articles: articles
  });
};

exports.signin = function (req, res) {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};
