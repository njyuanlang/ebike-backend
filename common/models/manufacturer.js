module.exports = function(Manufacturer) {

  Manufacturer.validatesUniquenessOf('name', {message: "制造商已经存在"})
  
  
  Manufacturer.afterRemote('create', function(ctx, manufacturer, next) {
    var now = new Date()
    var manufacturerUser = {
      manufacturerId: manufacturer.id,
      "name": manufacturer.name,
      email: manufacturer.email, 
      phone: manufacturer.phone,
      password: "123456", 
      realm: "manufacturer",
      created: now,
      updated: now
    }

    Manufacturer.app.models.User.create(manufacturerUser, function (err, user) {
      if(err) return next(err)
      next()
    })
  })
  
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
