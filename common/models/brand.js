module.exports = function(Brand) {
  
  Brand.observe('before save', function preventDuplicate(ctx, next) {
    if(ctx.instance && !ctx.instance.id) {
      Brand.findOne({where:{name:ctx.instance.name}}, function (err, entity) {
        if(entity) {
          err = new Error('品牌已经存在')
          err.status = 400
          next(err)
        } else {
          ctx.instance.created = new Date()
          next()
        }
      })
    } else {
      next()
    }
  })
  
};
