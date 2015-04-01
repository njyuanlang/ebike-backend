module.exports = function(Bike) {
  
  Bike.validatesUniquenessOf('serialNumber', {message: "序列号意见存在"})
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
