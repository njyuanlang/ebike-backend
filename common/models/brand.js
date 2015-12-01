var loopback = require('loopback');
var Promise = require("promise");

module.exports = function(Brand) {
  
  Brand.validatesUniquenessOf('name', {message: "品牌已经存在"})
  Brand.observe('before save', function timeStamp(ctx, next) {
    var now = new Date()
    if(ctx.instance) {
      ctx.instance.updated = now
      if(!ctx.instance.id) ctx.instance.created = now
    } else {
      ctx.data.updated = now
    }
    next()
  })
    
  Brand.observe('access', function limitToManufacturer(ctx, next) {
    var ObjectID = Brand.getDataSource().ObjectID
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.status = ctx.query.where.status || {neq: 'removed'};
    if(currentUser && currentUser.realm === 'manufacturer') {
      ctx.query.where['manufacturerId'] = ObjectID(currentUser.manufacturerId);
    }
    ctx.query.limit = ctx.query.limit || 10 ;
    next();
  })

  Brand.observe('before save', function limitToManufacturer(ctx, next) {
    var ObjectID = Brand.getDataSource().ObjectID
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    if(currentUser && currentUser.realm === 'manufacturer') {
      if(ctx.instance) {
        if(!ctx.instance.manufacturerId) {
          ctx.instance.manufacturerId = ObjectID(currentUser.manufacturerId);
        } else if (ctx.instance.manufacturerId.toString() !== currentUser.manufacturerId.toString()) {
          var err = new Error('Forbidden')
          err.status = 401
          return next(err)
        }
      } else {
        ctx.where = ctx.where || {};
        ctx.where['manufacturerId'] = ObjectID(currentUser.manufacturerId);
      }
    }
    next();
  })
};
