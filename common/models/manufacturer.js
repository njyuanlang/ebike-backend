module.exports = function(Manufacturer) {

  Manufacturer.beforeCreate = function (next, manufacturer) {
    
    Manufacturer.findOne({where:{name:manufacturer.name}}, function (err, entity) {
      if(entity) {
        err = new Error('制造商已经存在')
        err.status = 400
        next(err)
      } else {
        manufacturer.created = new Date()
        next()
      }
    })
    
  }
  
};
