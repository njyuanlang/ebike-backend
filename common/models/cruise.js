var loopback = require('loopback');

module.exports = function(Cruise) {

  Cruise.beforeRemote('create', function (ctx, unused, next) {
    if(ctx.req.body.bikeId) {
      Cruise.app.models.Bike.findById(ctx.req.body.bikeId, function (err, bike) {
        if(err) return next(err)
        ctx.req.body.bike = bike
        delete ctx.req.body.bikeId
        next()
      })
    } else {
      next(new Error('no bikeId'))
    }
  })

  Cruise.observe('before save', function timeStamp(ctx, next) {
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
