var request = require('request');

module.exports = function(Poi) {

  Poi.observe('before save', function createAmapRecord(ctx, next) {
    if(ctx.isNewInstance) {
      var form = {
        key: process.env.EBIKE_AMAP_RESTFUL_KEY,
        tableid: process.env.EBIKE_AMAP_TABLEID,
        loctype: 1,
        data: JSON.stringify(ctx.instance)
      };
      // console.log(form);
      request.post({
        url:'http://yuntuapi.amap.com/datamanage/data/create',
        form: form
      }, function (err, res, body) {
        if(err) return next(err);
        body = JSON.parse(body);
        if(body.status === 0) {
          err = new Error('Create Amap record error: '+body.info);
          err.status = 400;
          return next(err);
        } else {
          ctx.instance.amap_id = body._id;
          next();
        }
      });
    } else {
      next();
    }
  });
};
