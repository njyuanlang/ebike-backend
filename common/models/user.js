module.exports = function(User) {
  
  User.beforeRemote('create', function (ctx, unused, next) {
    if (ctx.req.body.authcode) {
      User.app.models.Authmessage.findOne({
        where:{phone: ctx.req.body.username}, 
        order:'created DESC'
      }, function (err, authmessage) {
        if(!authmessage) {
          err = new Error('not found auth code')
          err.status = 404
        } else if(authmessage.code !== parseInt(ctx.req.body.authcode, 10)){
          err = new Error('invalid auth code')
          err.status = 400
        } else if(authmessage.created+60*1000 < Date.now()) {
          err = new Error('outdate auth code')
          err.status = 400
          User.app.models.Authmessage.destroyById(authmessage.id)
        } else {
          User.app.models.Authmessage.destroyById(authmessage.id)
        }
        if(err) next(err)
        delete ctx.req.body.authcode
        next()
      })
    } else {
      var error = new Error('no authcode')
      error.status = 400
      next(error)
    }
  })
  
  User.beforeCreate = function (next, user) {
    
    User.findOne({where:{and:[{realm:user.realm}, {username:user.username}]}}, function (err, theUser) {
      if(theUser && theUser.realm === user.realm) {
        err = new Error('username already exist')
        err.status = 400
        next(err)
      } else {
        var now = Date.now()
        user.created = user.created||now
        user.lastUpdated = user.lastUpdated||now
        user.status = 'active'         
        user.name = user.name || user.username
        user.phone = user.phone || user.username
        next()
      }
    })  
  }
  
};
