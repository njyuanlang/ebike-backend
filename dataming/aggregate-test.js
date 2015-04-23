
db.test.aggregate(
  [
    { $match: { 'bike.brand.name': '雅迪', 'bike.owner.region.province': '江苏'} },
    { $unwind: "$items"},
    { 
      $project: {
        items: 1,
        period: {
          $let: {
            vars: {
              interval: {$multiply: [86400000, 30]},
              duration: {$subtract: ["$created", "$bike.created"]}
            },
            in: {
              $multiply: [ 
                30, 
                { $add : [1, {$divide: [{$subtract:["$$duration", {$mod: ["$$duration", "$$interval"]}]}, "$$interval"]}] } 
              ] 
            }
          }
        }
      }
    },
    {
      $group: { 
        _id: "$period",
        brake: {$sum: {$cond: [{$and: [{$eq: ["$items.id", "brake"]}, {$ne: ["$items.state", "pass"]}]}, 1, 0]}}, 
        motor: {$sum: {$cond: [{$and: [{$eq: ["$items.id", "motor"]}, {$ne: ["$items.state", "pass"]}]}, 1, 0]}},
        controller: {$sum: {$cond: [{$and: [{$eq: ["$items.id", "controller"]}, {$ne: ["$items.state", "pass"]}]}, 1, 0]}},
        steering: {$sum: {$cond: [{$and: [{$eq: ["$items.id", "steering"]}, {$ne: ["$items.state", "pass"]}]}, 1, 0]}}
      }
    }
  ]
).forEach(printjson)