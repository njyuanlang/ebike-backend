module.exports = function(Manufacturer) {

  Manufacturer.validatesUniquenessOf('name', {message: "制造商已经存在"})
  Manufacturer.observe('before save', function timeStamp(ctx, next) {
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
