var Promise = require("promise");

module.exports = function(User) {
  
  var validateCode = function (body, next) {
    if (body.authcode) {
      var Authmessage = User.app.models.Authmessage
      Authmessage.findOne({
        where:{phone: body.username}, 
        order:'created DESC'
      }, function (err, message) {
        if(!message) {
          err = new Error('not found auth code')
          err.status = 404
        } else if(message.code !== parseInt(body.authcode, 10)){
          err = new Error('invalid auth code')
          err.status = 400
        } else if(message.created+60*1000 < Date.now()) {
          err = new Error('outdate auth code')
          err.status = 400
          Authmessage.destroyById(message.id)
        } else {
          Authmessage.destroyById(message.id)
        }
        if(err) next(err)
        delete body.authcode
        next()
      })
    } else {
      var error = new Error('no authcode')
      error.status = 400
      next(error)
    }
  }
  
  User.beforeRemote('create', function (ctx, unused, next) {
    var user = ctx.req.body
    validateCode(user, function (err) {
      if(err) return next(err)

      User.findOne({where:{and:[{realm:user.realm}, {username:user.username}]}}, function (err, theUser) {
        if(theUser) {
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
    })
    
  })
  
  User.beforeRemote('resetPassword', function (ctx, unused, next) {
    
    var body = ctx.req.body
    validateCode(body, function (err) {
      if(err) return next(err)
      
      User.findOne({where:{and:[{realm:body.realm}, {username:body.username}]}}, function (err, user) {
        if(user) {
          user.updateAttribute('password', body.password, function (err, user) {
            next(err)
          })
        } else {
          err = new Error('user not exist')
          err.status = 400
          next(err)
        }
      })  
    })
  })
  
  User.stat = function (filter, next) {
    filter.where = User._coerce(filter.where)
    var connector = User.getDataSource().connector
    filter.where = connector.buildWhere('user', filter.where)
    var collection = connector.collection('user')
    collection.aggregate([
      {
        $match: filter.where
      },
      {
        $group: {
          _id: {year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}},
          count: {$sum: 1}
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ],function (err, results) {
      if(err) {
        next(err)
      } else {
        next(null, results)
      }
    })    
  }
  
  User.remoteMethod(
    'stat',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}, root:true}
      ],
      returns: {arg:'data', type: 'Array', root: true},
      http: {verb: 'get'}
    }
  )
};
