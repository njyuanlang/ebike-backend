module.exports = function(Test) {

  Test.beforeRemote('create', function (ctx, unused, next) {
    if(ctx.req.body.bikeId) {
      Test.app.models.Bike.findById(ctx.req.body.bikeId, function (err, bike) {
        if(err) return next(err)
        ctx.req.body.bike = bike
        delete ctx.req.body.bikeId
        next()
      })
    } else {
      next(new Error('no bikeId'))
    }
  })

  Test.observe('before save', function timeStamp(ctx, next) {
    var now = new Date()
    if(ctx.instance) {
      ctx.instance.updated = now
      if(!ctx.instance.id) ctx.instance.created = now
    } else {
      ctx.data.updated = now
    }
    next()
  })  

  Test.stat = function (filter, next) {
    var Model = Test
    filter.where = Model._coerce(filter.where)
    var connector = Model.getDataSource().connector
    filter.where = connector.buildWhere(Model.modelName, filter.where)
    var collection = connector.collection(Model.modelName)
    collection.aggregate([
      {
        $match: filter.where
      },
      {
        $group: {
          _id: {year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}},
          count: {$sum: 1}
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ],function (err, results) {
      if(err) {
        next(err)
      } else {
        next(null, results)
      }
    })    
  }
  
  Test.remoteMethod(
    'stat',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}, root:true}
      ],
      returns: {arg:'data', type: 'Array', root: true},
      http: {verb: 'get'}
    }
  )
};
