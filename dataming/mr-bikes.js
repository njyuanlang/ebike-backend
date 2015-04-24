// ===================
// Perpare
// ===================
db.test.find({"bike.created":{$exists: true}}).forEach(function (item) {
  item.bike.created = new Date(item.bike.created)
  item.bike.updated = new Date(item.bike.updated)
  db.test.save(item)
})

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
    out: "stat-bike",
    finalize: finalize,
    scope: {reduceFunc: reduce} 
}

// db.bike.mapReduce(
//   dailyMap,
//   reduce,
//   mrOptions
// )


// var ud = {
//   year: 2015,
//   month: 4,
//   dayOfMonth: 3
// }
// var groupByCreatedBikes = db.bike.aggregate(
//   [
//     {
//       $match: {
//         "created": {
//           $gte: new Date(ud.year, ud.month-1, ud.dayOfMonth),
//           $lt: new Date(ud.year, ud.month-1, ud.dayOfMonth)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: {year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}},
//         total: {$sum: 1}
//       }
//     }
//   ]
// ).toArray()
//
// db['stat-bike'].insert(groupByCreatedBikes)
//
// db["stat-bike"].aggregate(
//   [
//     {
//       $match: {"_id.year": {$lte: ud.year}, "_id.month": {$lte: ud.month}, "_id.dayOfMonth": {$lte: ud.dayOfMonth}}
//     },
//     {
//       $group: {
//         _id: 0,
//         totalAll: {$sum: "$total"}
//       }
//     }
//   ]
// ).forEach(function (item) {
//   db["stat-bike"].update(
//     {_id: ud},
//     {$set:{totalAll: item.totalAll}},
//     {upsert: true}
//   )
// })
//
// db.bike.aggregate(
//   [
//     {
//       $group: {
//         _id: {brandId: "$brand.id", year: {$year: "$created"}, month: {$month: "$created"}, dayOfMonth: {$dayOfMonth: "$created"}},
//         day: {$first: "$created"},
//         brandName: {$first: "$brand.name"},
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $out: "stat-brand"
//     }
//   ]
// )
//
// db['stat-bike'].find().forEach(function (item) {
//   db['stat-brand'].update(
//     {"_id.year": item._id.year, "_id.month": item._id.month, "_id.dayOfMonth": item._id.dayOfMonth},
//     {$set:{total: item.total}},
//     {multi: true}
//   )
// })

// var beginDate = "2015/04/03"
// var endDate = "2015/04/09"
// db.bike.aggregate(
//   [
//     {
//       $match: {
//         created: {$gt: new Date(beginDate), $lte: new Date(endDate)}
//       }
//     },
//     {
//       $group: {
//         _id: "$brand.name",
//         count: {$sum: 1}
//       }
//     },
//     {
//       $sort: {count: -1}
//     }
//   ]
// ).forEach(printjson)

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