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
  
  Brand.stat = function (beginDate, endDate, next) {
    var collection = Brand.getDataSource().connector.collection('bike')
    var p1 = new Promise(function (resolve, reject) {
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
        if(err) {
          reject(err)
        } else {
          collection.aggregate([
            {
              $match: {
                created: {$lte: new Date(endDate)},
                "brand.name": {$in: results.map(function (item) {
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
        if(err) {
          reject(err)
        } else {
          var ret = results[0] || {total:0}
          resolve(ret.total)
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
