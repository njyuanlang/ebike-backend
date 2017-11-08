var LoopBackContext = require('loopback-context');
var async = require('async');

module.exports = function(Message) {
  
  Message.chats = function (filter, options, next) {
    filter = filter || {}
    filter.where = filter.where || {}
    var accessToken = options && options.accessToken;
    var userId = accessToken && accessToken.userId
    filter.where.or = [{ToUserName: userId}, {FromUserName: userId}];

    var Model = Message;
    filter.where = Model._coerce(filter.where)
    var connector = Model.getDataSource().connector
    filter.where = connector.buildWhere(Model.modelName, filter.where)
    var collection = connector.collection(Model.modelName)
    collection.aggregate([
      { $match: filter.where },
      { $sort: { CreateTime: -1} },
      {
        $group: {
          _id: { $cond: [{$eq: ["$ToUserName", userId]}, "$FromUserName", "$ToUserName"]},
          message: { $first: "$$ROOT"}
        }
      }
      // { $project: {_id: 0, userCount: { $size: "$users"}} }
      // { $sort: { updatetime: -1 } }
    ],function (err, results) {
      if(err) {
        next(err)
      } else {
        async.each(results, function (item, cb) {
          Message.app.models.user.findById(item._id, function (err, user) {
            item.user = user;
            cb(err);
          });
        }, function (err) {
          next(err, results);
        });
      }
    })
  };
  
  Message.remoteMethod(
    'chats',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}, root:true},
        {"arg": "options", "type": "object", "http": "optionsFromRequest"}
      ],
      returns: {arg:'data', type: 'Array', root: true},
      http: {verb: 'get'}
    }
  );
  
  Message.beforeRemote('create', function (ctx, modelInstance, next) {
    ctx.req.body.FromUserName = ctx.req.accessToken.userId;
    ctx.req.body.CreateTime = Math.round(Date.now()/1000);
    ctx.req.body.MsgType = ctx.req.body.MsgType || 'text';
    next();
  });

  Message.observe('access', function limitScope(ctx, next) {
    var accessToken = ctx.options && ctx.options.accessToken;
    var userId = accessToken && accessToken.userId
    
    ctx.query.order = ctx.query.order || 'CreateTime DESC';
    ctx.query.limit = ctx.query.limit || 10;
    ctx.query.skip = ctx.query.skip || 0;
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.and = ctx.query.where.and || [];
    ctx.query.where.and.push({or:[{ToUserName: userId}, {FromUserName: userId}]});
    // console.log(JSON.stringify(ctx.query.where.and));
    next();
  });
};