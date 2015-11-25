var loopback = require('loopback');

module.exports = function(Mass) {

  Mass.beforeRemote('create', function (ctx, unused, next) {
    ctx.req.body.FromUserName = ctx.req.accessToken.userId;
    ctx.req.body.CreateTime = Math.round(Date.now()/1000);
    ctx.req.body.MsgType = ctx.req.body.MsgType || 'text';
    next();
  });
  
  Mass.afterRemote('create', function doMass(ctx, modelInstance, next) {
    modelInstance.tousers.forEach(function (userId) {
      Mass.app.models.Message.create({
        ToUserName: userId,
        FromUserName: modelInstance.FromUserName,
        MsgType: modelInstance.MsgType,
        Content: modelInstance.Content,
        CreateTime: modelInstance.CreateTime,
        MassId: modelInstance.id
      });
    });
    next();
  });
  
  Mass.observe('access', function limitToUser(ctx, next) {
    var context = loopback.getCurrentContext()
    var currentUser = context && context.get('currentUser');
    
    ctx.query.order = ctx.query.order || 'CreateTime DESC';
    ctx.query.limit = ctx.query.limit || 10;
    ctx.query.skip = ctx.query.skip || 0;
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.FromUserName = currentUser.id;
    console.log(JSON.stringify(ctx.query.where));
    next();
  });
};
