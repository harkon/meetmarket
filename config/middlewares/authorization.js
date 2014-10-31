/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
  // console.log("is user %s authenticated? : %s", req.user.firstname, req.isAuthenticated())
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
}

/*
 *  Shop authorization routing middleware
 */

exports.store = {
  hasAuthorization: function(req, res, next) {
    if (req.session.storeId != req.store._id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/stores/')
    }
    next()
  }
}

/**
 * Category authorization routing middleware
 */

exports.category = {
  hasAuthorization: function(req, res, next) {
    // if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
    //   next()
    // } else {
    //   req.flash('info', 'You are not authorized')
    //   res.redirect('/articles/' + req.article.id)
    // }
    next();
  }
}