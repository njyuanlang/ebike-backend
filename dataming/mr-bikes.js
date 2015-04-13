// ===================
// Perpare
// ===================
// db.merchants.find().forEach(function (merchant) {
//   db.skus.update(
//     {shopID: { $in: merchant.shopIDs}},
//     {$set:{merchantID: merchant._id}},
//     {multi: true}
//   )
// })

// ===================
// Dialy
// ===================

var dailyMap = function () {
  var d = this.created
  var day = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
  var value = {
    name: this.brand.name,
    count: 1
  }

  emit( this.brand.id+'#'+day, value) 
}

var reduce = function (key, values) {
  var keys = key.split('#')
  var reduceVal = { 
    count: 0,
    keyID: keys[0], 
    statAt: keys[1]
  }
  values.forEach(function (value) {
    reduceVal.count += value.count
    reduceVal.name = value.name
  })
  return reduceVal;
}

var finalize = function (key, reduceValue) {
  if(!reduceValue.keyID) {
    var values = [reduceValue];
    return reduceFunc(key, values);
  } else {
    var keys = key.split('#')
    var statAt = keys[1]
    if(statAt !== reduceValue.statAt) {
      reduceValue.statAt = statAt
    }
  }
  return reduceValue;
}

var mrOptions = {
    // query: {createdAt: {$gte:1387871468}}, 
    out: "stat-brand",
    finalize: finalize,
    scope: {reduceFunc: reduce} 
}

// db.bike.mapReduce(
//   dailyMap,
//   reduce,
//   mrOptions
// )

db.bike.aggregate(
  [
    {
      $group: {
        _id: {year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}},
        total: {$sum: 1}
      }
    },
    {
      $out: {merge: "stat-bike"}
    }
  ]
)

// db.bike.aggregate(
//   [
//     {
//       $group: {
//         _id: 0,
//         total: {$sum: 1}
//       }
//     },
//     {
//       $out: "stat-bike"
//     }
//   ]
// )

db.bike.aggregate(
  [
    {
      $group: {
        _id: {brandId: "$brand.id", year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}}, 
        day: {$first: "$created"},
        brandName: {$first: "$brand.name"},
        count: { $sum: 1 }
      }
    },
    {
      $out: "stat-brand"
    }
  ]
)

db['stat-bike'].find().forEach(function (item) {
  db['stat-brand'].update(
    {"_id.year": item._id.year, "_id.month": item._id.month, "_id.dayOfMonth": item._id.dayOfMonth},
    {$set:{total: item.total}},
    {multi: true}
  )
})

var beginDate = new Date(2015, 3, 2)
var endDate = new Date(2015, 3, 9)
db['stat-brand'].aggregate(
  [
    {
      $match: {day: {$gt: beginDate, $lte: endDate}}
    },
    {
      $group: {
        _id: "$brandName",
        count: {$sum: "$count"}
      }
    }
  ]
)
// ===================
// Weekly
// ===================

// var weeklyMap = function () {
//   var week = parseInt((this.value.statAt-3)/7, 10)
//
//   emit( this.value.keyID+'#'+week+'#'+this.value.itemID+'#'+this.value.type, this.value)
// }
//
// mrOptions.out = 'skus-weekly'
// db['skus-daily'].mapReduce(
//   weeklyMap,
//   reduce,
//   mrOptions
// )

// db['skus-weekly'].find().forEach(printjson)

// ===================
// Monthly
// ===================

// var monthlyMap = function () {
//   var d = new Date(this.value.statAt*86400000)
//   var month = (d.getFullYear()-1970)*12+d.getMonth()
//
//   emit( this.value.keyID+'#'+month+'#'+this.value.itemID+'#'+this.value.type, this.value)
// }
//
// mrOptions.out = 'skus-monthly'
// db['skus-daily'].mapReduce(
//   monthlyMap,
//   reduce,
//   mrOptions
// )

// db['skus-monthly'].find().forEach(printjson)