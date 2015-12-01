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
  
  Brand.stat = function (filter, next) {
    console.log(filter);
    var collection = Brand.getDataSource().connector.collection('bike')
    var now = Date.now();
    filter = filter || {};
    filter.where = filter.where || {};
    filter.beginDate = filter.beginDate || now-86400000*30;
    filter.endDate = filter.endDate || now;
    
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    if(currentUser && currentUser.realm === 'manufacturer') {
      filter.where['brand.manufacturerId'] = currentUser.manufacturerId;
    }
    
    var p1 = new Promise(function (resolve, reject) {
      var group = {
        aggregate: {$sum: 1}, 
        count: {$sum: "$hit"}
      };
      group._id = filter.where["brand.id"]?"$model":"$brand.name";
      collection.aggregate([
        {$project: {brand:1, model:1, hit: {$cond: [
          {$and: [
            {$gt: ["$created", new Date(filter.beginDate)]}, 
            {$lte: ["$created", new Date(filter.endDate)]}
          ]}, 1, 0]}}
        },
        {$match: filter.where},
        {$group: group},
        {$sort: {count: -1, _id: -1}},
        {$skip: filter.skip || 0},
        {$limit: filter.limit || 10}
      ],function (err, results) {
        if(err) {
          reject(err)
        } else {
          resolve(results);
        }
      })
    })
    
    var p2 = new Promise(function (resolve, reject) {
      var where = {"created": {$gt: new Date(filter.beginDate), $lte: new Date(filter.endDate)}};
      for(var k in filter.where) {
        where[k] = filter.where[k];
      }
      collection.count(where , function (err, count) {
        if(err) {
          reject(err)
        } else {
          resolve(count)
        }
      })
    })
    
    var p3 = new Promise(function (resolve, reject) {
      collection.count(filter.where, function (err, count) {
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
      accepts: [{arg:'filter', type: 'Object', root:true}],
      returns: {arg:'data', type: 'Object', root: true},
      http: {verb: 'get'}
    }
  )
  
  Brand.observe('access', function limitToManufacturer(ctx, next) {
    var ObjectID = Brand.getDataSource().ObjectID
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.status = ctx.query.where.status || {neq: 'removed'};
    if(currentUser && currentUser.realm === 'manufacturer') {
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
        } else if (ctx.instance.manufacturerId.toString() !== currentUser.manufacturerId.toString()) {
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
