var loopback = require('loopback');
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
  
  Brand.observe('access', function limitToManufacturer(ctx, next) {
    var ObjectID = Brand.getDataSource().ObjectID
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    if(currentUser && currentUser.realm === 'manufacturer') {
      ctx.query.where = ctx.query.where || {};
      ctx.query.where['manufacturerId'] = ObjectID(currentUser.manufacturerId);
    }
    ctx.query.limit = ctx.query.limit || 10 ;
    next();
  })

  Brand.observe('before save', function limitToManufacturer(ctx, next) {
    var ObjectID = Brand.getDataSource().ObjectID
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    if(currentUser && currentUser.realm === 'manufacturer') {
      if(ctx.instance) {
        if(!ctx.instance.manufacturerId) {
          ctx.instance.manufacturerId = ObjectID(currentUser.manufacturerId);
        } else if (ctx.instance.manufacturerId.toString() !== currentUser.manufacturerId) {
          var err = new Error('Forbidden')
          err.status = 401
          return next(err)
        }
      } else {
        ctx.where = ctx.where || {};
        ctx.where['manufacturerId'] = ObjectID(currentUser.manufacturerId);
      }
    }
    next();
  })
};
