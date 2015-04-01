module.exports = function(Device) {

  Device.validatesUniquenessOf('serialNumber', {message: "序列号已经存在"})
  Device.observe('before save', function timeStamp(ctx, next) {
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
