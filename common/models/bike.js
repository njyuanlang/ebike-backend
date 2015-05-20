var Promise = require("promise");

module.exports = function(Bike) {

  Bike.beforeRemote('create', function (ctx, unused, next) {
    if(ctx.req.accessToken) {
      Bike.app.models.User.findById(ctx.req.accessToken.userId, function (err, owner) {
        ctx.req.body.owner = owner
        next()
      })
    } else {
      next()
    }
  })
  
  // Because of serial number has not been ready, so comment follow validate
  // Bike.validatesUniquenessOf('serialNumber', {message: "序列号已经存在"})
  
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
  
  Bike.stat = function (filter, next) {
    var Model = Bike
    filter.where = Model._coerce(filter.where)
    var connector = Model.getDataSource().connector
    filter.where = connector.buildWhere(Model.modelName, filter.where)
    var collection = connector.collection(Model.modelName)
    collection.aggregate([
      { $match: filter.where },
      {
        $group: {
          _id: {year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}},
          count: {$sum: 1}
        }
      },
      { $sort: { _id: 1 } }
    ],function (err, results) {
      if(err) {
        next(err)
      } else {
        next(null, results)
      }
    })    
  }
  
  Bike.remoteMethod(
    'stat',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}, root:true}
      ],
      returns: {arg:'data', type: 'Array', root: true},
      http: {verb: 'get'}
    }
  )

  Bike.statRegion = function (beginDate, endDate, next) {
    var collection = Bike.getDataSource().connector.collection('bike')
    var p1 = new Promise(function (resolve, reject) {
      collection.aggregate([
        {
          $match: {
            created: {$gt: new Date(beginDate), $lte: new Date(endDate)}
          }
        },
        {
          $group: {
            _id: "$owner.region.province",
            count: {$sum: 1}
          }
        },
        {
          $sort: {count: -1}
        }
      ],function (err, results) {
        if(err) {
          reject(err)
        } else {
          collection.aggregate([
            {
              $match: {
                created: {$lte: new Date(endDate)},
                "owner.region.province": {$in: results.map(function (item) {
                  return item._id
                })}
              }
            },
            {
              $group: {
                _id: "$owner.region.province",
                aggregate: {$sum: 1}
              }
            },
            {
              $sort: {_id: -1}
            }
          ], function (err, arr) {
            if(err) return reject(err)
            var res = {}
            arr.forEach(function (item) {
              res[item._id] = item.aggregate
            })
            results.forEach(function (item, index) {
              item.aggregate = res[item._id]
            })
            resolve(results)
          })      
        }
      })
    })
    
    var p2 = new Promise(function (resolve, reject) {
      collection.count({created:{$gt: new Date(beginDate), $lte: new Date(endDate)}}, function (err, count) {
        if(err) {
          reject(err)
        } else {
          resolve(count)
        }
      })
    })
    
    var p3 = new Promise(function (resolve, reject) {
      collection.count({}, function (err, count) {
        if(err) {
          reject(err)
        } else {
          resolve(count)
        }
      })
    })
    
    Promise.all([p1, p2, p3])
    .then(function (values) {
      next(null, {
        data: values[0],
        total: values[1],
        aggregateTotal: values[2]
      })
    }, next)
  }
  
  Bike.remoteMethod(
    'statRegion',
    {
      accepts: [
        {arg:'beginDate', type: 'Date'},
        {arg:'endDate', type: 'Date'}
      ],
      returns: {arg:'data', type: 'Object', root: true},
      http: {verb: 'get'}
    }
  )
  
  Bike.findUsersByManufacturer = function (filter, next) {
    filter = filter || {}
    var Model = Bike
    filter.where = Model._coerce(filter.where)
    var connector = Model.getDataSource().connector
    filter.where = connector.buildWhere(Model.modelName, filter.where)
    var collection = connector.collection(Model.modelName)
    console.log(filter)
    collection.aggregate([
      { $match: filter.where },
      { $project: { _id: 0, owner: 1 } },
    	{
    		$group: {_id: "$owner.id", user: { $first: "$owner"} }
    	},
      { $sort: { _id: 1 } }
    ],function (err, results) {
      if(err) {
        next(err)
      } else {
        next(null, results)
      }
    })    
  }
  
  Bike.remoteMethod(
    'findUsersByManufacturer',
    {
      accepts: [
        {arg:'filter', type: 'Object', http: {source: 'query'}, root:true}
      ],
      returns: {arg:'data', type: 'Array', root: true},
      http: {verb: 'get'}
    }
  )
  
};
