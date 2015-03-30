module.exports = function(Brand) {
  
  Brand.beforeCreate = function (next, brand) {
    
    Brand.findOne({where:{name:brand.name}}, function (err, entity) {
      if(entity) {
        err = new Error('brand already exist')
        err.status = 400
        next(err)
      } else {
        brand.created = new Date()
        next()
      }
    })
    
  }

};
