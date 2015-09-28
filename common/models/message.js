var loopback = require('loopback');

module.exports = function(Message) {
  
  Message.beforeRemote('create', function (ctx, modelInstance, next) {
    ctx.req.body.FromUserName = ctx.req.accessToken.userId;
    next();
  });

  Message.chats = function (filter, next) {
    filter = filter || {}
    filter.where = filter.where || {}
    var context = loopback.getCurrentContext()
    var currentUser = context && context.get('currentUser');
    var currentUserId = currentUser.id.toString();
    filter.where.or = [{ToUserName: currentUserId}, {FromUserName: currentUserId}];

    var Model = Message;
    filter.where = Model._coerce(filter.where)
    var connector = Model.getDataSource().connector
    filter.where = connector.buildWhere(Model.modelName, filter.where)
    var collection = connector.collection(Model.modelName)
    collection.aggregate([
      { $match: filter.where },
      {
        $group: {
          _id: { $cond: [{$eq: ["$ToUserName", currentUserId]}, "$FromUserName", "$ToUserName"]},
          updatetime: { $last: "$CreateTime"},
          messages: { $push: "$$ROOT"}
        }
      },
      // { $project: {count: 1, userCount: { $size: "$users"}} },
      { $sort: { updatetime: 1 } }
    ],function (err, results) {
      if(err) {
        next(err)
      } else {
        next(null, results)
      }
    })
  };
  
  Message.remoteMethod(
    'chats',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}, root:true}
      ],
      returns: {arg:'data', type: 'Array', root: true},
      http: {verb: 'get'}
    }
  );
  
  Message.observe('access', function limitScope(ctx, next) {
    var context = loopback.getCurrentContext()
    var currentUser = context && context.get('currentUser');
    var currentUserId = currentUser.id.toString();
    
    ctx.query.order = ctx.query.order || 'CreateTime DESC';
    ctx.query.limit = ctx.query.limit || 10;
    ctx.query.skip = ctx.query.skip || 0;
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.or = [{ToUserName: currentUserId}, {FromUserName: currentUserId}];
    next();
  })
};
