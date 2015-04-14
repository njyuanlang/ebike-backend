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
  
  Brand.stat = function (beginDate, endDate, next) {
    var result = {}
    var collection = Brand.getDataSource().connector.collection('bike')
    collection.aggregate([
      {
        $match: {
          created: {$gt: new Date(beginDate), $lte: new Date(endDate)}
        }
      },
      {
        $group: {
          _id: "$brand.name",
          count: {$sum: 1}
        }
      },
      {
        $sort: {count: -1}
      }
    ],function (err, results) {
      if(err) next(err)
      result.data = results
      
      collection.aggregate([
        {
          $match: {
            created: {$gt: new Date(beginDate), $lte: new Date(endDate)}
          }
        },
        {
          $group: {
            _id: null,
            total: {$sum: 1}
          }
        }
      ], function (err, results) {
        result.total = results[0].total
        collection.count({}, function (err, count) {
          result.aggregateTotal = count
          collection.aggregate([
            {
              $match: {
                created: {$lte: new Date(endDate)},
                "brand.name": {$in: result.data.map(function (item) {
                  return item._id
                })}
              }
            },
            {
              $group: {
                _id: "$brand.name",
                aggregate: {$sum: 1}
              }
            },
            {
              $sort: {_id: -1}
            }
          ], function (err, results) {
            var res = {}
            results.forEach(function (item) {
              res[item._id] = item.aggregate
            })
            result.data.forEach(function (item, index) {
              item.aggregate = res[item._id]
            })
            next(err, result)
          })
        })
      })
    })    
  }
  
  Brand.remoteMethod(
    'stat',
    {
      accepts: [
        {arg:'beginDate', type: 'Date'},
        {arg:'endDate', type: 'Date'}
      ],
      returns: {arg:'data', type: 'Object', root: true},
      http: {verb: 'get'}
    }
  )
};
