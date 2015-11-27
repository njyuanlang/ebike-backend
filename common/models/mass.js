var loopback = require('loopback');


module.exports = function(Mass) {
  
  Mass.beforeRemote('create', function (ctx, unused, next) {
    ctx.req.body.FromUserName = ctx.req.accessToken.userId;
    ctx.req.body.CreateTime = Math.round(Date.now()/1000);
    ctx.req.body.MsgType = ctx.req.body.MsgType || 'text';
    var where = ctx.req.body.where;
    var filter = {limit: 99999999};

    var context = loopback.getCurrentContext()
    var currentUser = context && context.get('currentUser');
    if(currentUser.realm === 'administrator') {
      filter.where = {realm: 'client'};
      if(where.region) {
        if(where.region.city) {
          filter.where.region = {eq: where.region};
        } else if(where.region.province) {
          filter.where['region.province'] = where.region.province;
        }
      }
      Mass.app.models.User.find(filter, function (err, results) {
        if(err) return next(err);
        ctx.req.body.tousers = results.map(function (item) {
          return item.id;
        });
        next();
      });
    } else if(currentUser.realm === 'manufacturer') {
      filter.where = {"owner.realm": 'client'};
      if(where.region) {
        if(where.region.city) {
          filter.where["owner.region"] = {eq: where.region};
        } else if(where.region.province) {
          filter.where['owner.region.province'] = where.region.province;
        }
      }
      Mass.app.models.Bike.findUsersByManufacturer(filter, function (err, results) {
        if(err) return next(err);
        ctx.req.body.tousers = results.map(function (item) {
          return item.user.id;
        });
        next();
      });
    } else {
      return next(new Error('realm forbidden'))
    }
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
    // console.log("Mass where:",JSON.stringify(ctx.query.where));
    next();
  });
};
