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
    var collection = Brand.getDataSource().connector.collection('stat-brand')
    collection.aggregate(
      [
        {
          $match: {day: {$gt: new Date(beginDate), $lte: new Date(endDate)}}
        },
        {
          $group: {
            _id: "$brandName",
            count: {$sum: "$count"},
            total: {$first: "$total"}
          }
        }
      ],
      function (err, results) {
        if(err) next(err)
        next(err, results)
      }
    )    
  }
  
  Brand.remoteMethod(
    'stat',
    {
      accepts: [
        {arg:'beginDate', type: 'Date'},
        {arg:'endDate', type: 'Date'}
      ],
      returns: {arg:'data', type: 'array', root:true},
      http: {verb: 'get'}
    }
  )
};
