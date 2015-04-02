module.exports = function(Bike) {
  
  Bike.beforeRemote('create', function (ctx, unused, next) {
    if(ctx.req.accessToken) {
      ctx.req.body.ownerId = ctx.req.accessToken.userId
    }
    next()
  })
  
  Bike.validatesUniquenessOf('serialNumber', {message: "序列号已经存在"})
  
  Bike.observe('before save', function timeStamp(ctx, next) {
    var now = new Date()
    if(ctx.instance) {
      ctx.instance.updated = now
      if(!ctx.instance.id) ctx.instance.created = now
    } else {
      ctx.data.updated = now
    }
    next()
  })
};
