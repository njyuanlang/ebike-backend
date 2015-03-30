module.exports = function(Brand) {
  
  Brand.beforeCreate = function (next, brand) {
    
    Brand.findOne({where:{name:brand.name}}, function (err, entity) {
      if(entity) {
        err = new Error('品牌已经存在')
        err.status = 400
        next(err)
      } else {
        brand.created = new Date()
        next()
      }
    })
    
  }

};
