var loopback = require('loopback');
var Promise = require("promise");
var encoding = require('encoding');
var moment = require('moment');

module.exports = function(User) {
  
  var validateCode = function (body, next) {
    if (body.realm !== 'client') return next()
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
          next()
        }
      })  
    })
  });
  
  User.observe('before save', function autocomplete(ctx, next) {
    if(ctx.isNewInstance) {
      var user = ctx.instance;
      var now = Date.now();
      user.created = user.created||now;
      user.lastUpdated = user.lastUpdated||now;
      user.status = 'active';
      user.username = user.username || user.email;
      user.name = user.name || user.username;
      user.phone = user.phone || user.username;
    }
    next();
  });
  
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
    var Model = User
    filter.where = Model._coerce(filter.where)
    var connector = Model.getDataSource().connector
    filter.where = connector.buildWhere(Model.modelName, filter.where)
    var collection = connector.collection(Model.modelName)
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
  );
  
  User.export = function (filter, res, next) {
    var context = loopback.getCurrentContext()
    var currentUser = context && context.get('currentUser');
    if(!currentUser || currentUser.realm !== 'manufacturer' && currentUser.realm !== 'administrator') {
      return next(new Error('Not Manufacturer'))
    }
    
    filter = filter || {};
    filter.limit = filter.limit || 5000;
    if(filter.limit > 5000) filter.limit = 5000;
    var csv = '"用户名";"姓名";"电话";"email";"省";"城市";"注册时间"\n'
    User.find(filter, function (err, results) {
      results.forEach(function (u) {
        if(!u) {
          csv +='"未知用户";"";"";"";"";"";""\n';
        } else {
          csv += '"'+u.username+'";"'+u.name+'";"'+u.phone+'";"'+u.email+'";"';
          if(u.region) {
            csv += u.region.province+'";"'+u.region.city+'";"'
          } else {
            csv += '";"";"';
          }
          csv += moment(u.created).format('YYYY-MM-DD HH:mm:ss')+'"\n';
        }
      });
      var chineseCsv = encoding.convert(csv, 'GB18030');
      var filename=currentUser.email+"_"+Date.now()+".csv";
      res.setHeader('Pragma', 'public');
      res.setHeader('Expires', '0');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.set('Content-Type','application/octet-stream');
      // res.setHeader('Content-Type', 'text/csv; charset=GBK');
      res.setHeader('Content-Disposition', 'attachment;filename="'+ filename +'"');
      res.setHeader('Content-Length', chineseCsv.length);
      res.set('Content-Transfer-Encoding','binary');
      res.end(chineseCsv); 
      // console.log(chineseCsv);
    });
  };
  
  User.remoteMethod(
    'export',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}},
        {arg: 'res', type: 'object', http: {source: 'res'}}
      ],
      http: {verb: 'get'}
    }
  );  
};
