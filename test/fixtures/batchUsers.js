var fs = require('fs')
var csv = require('csv')
var MongoClient = require('mongodb').MongoClient

var csvfile = process.argv[2];
var url = "mongodb://localhost:27017/ebike";

function batchAdd(db) {
  var collection = db.collection('user2')

  fs.createReadStream(csvfile)
  .pipe(csv.parse())
  .pipe(csv.transform(function (item) {
    var phone = item[2];
    var data = {
      "realm": "client",
      "username": phone,
      "password": "$2a$10$MuJJODcUkgepPo2NGQgFd.9UQepaLWQhsC4xvWEJWcwkEP9sYMJA2",
      "email": phone+"@example.com",
      "status": "active",
      "created": new Date(item[1]),
      "lastUpdated": new Date(item[1]),
      "name": phone,
      "phone": phone,
      "region": {
        "province": "江苏省",
        "city": "南京市"
      }
    }
    collection.updateOne({username: phone}, data, {upsert: true})
  }))
}

function updateUsers(db) {
  var user2 = db.collection('user2')
  db.collection('user').find({}).toArray().then(function (items) {
    items.forEach(function (item) {
      user2.findOneAndReplace({username: item.username}, item)
      console.log(item);
    })
  })
  .catch(function (err) {
    console.log(arguments);
  })
}

MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  
  // batchAdd(db)
  updateUsers(db)
  // db.close();
});
