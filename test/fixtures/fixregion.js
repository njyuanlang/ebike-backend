//直辖市
db.user.find({"region.province": {$regex:/[北京, 上海, 天津,重庆]$/m}})
.forEach(function (doc) {  
  var city = doc.region.province+"市";
  db.user.update({_id: doc._id}, {$set: {region: {province: city, city: city}}});
})

//省
db.user.find({"region.province": {$regex:/[^省市]$/m}})
.forEach(function (doc) {
  // printjson(doc);
  var province = doc.region.province+"省";
  var city = doc.region.city+"市";
  db.user.update({_id: doc._id}, {$set: {region: {province: province, city: city}}});
})