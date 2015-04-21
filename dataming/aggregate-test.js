
db.test.aggregate(
  [
    { 
      $project: {
        items: 1, 
        period: {
          $let: {
            vars: {
              interval: 1,
              duration: {$subtract: ["$created", "$bike.created"]}
            },
            in: {
              $multiply: [ 
                30, 
                {
                  $divide : [{$subtract:["$$duration", {$mod: ["$$duration", 2592000000]}] }, 2592000000]
                } 
              ] 
            }
          }
        }
      }
    },
    { $group: { _id: "$period", count:{$sum: 1} } }
  ]
).forEach(printjson)