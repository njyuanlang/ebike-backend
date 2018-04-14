// Weapp nodejs SDK
var querystring = require('querystring');
var request = require('request');
var config = {
  appid: process.env.WEAPP_ID,
  secret: process.env.WEAPP_SECRET,
  grant_type: 'authorization_code'
};

module.exports = function (options) {
  return function (req, res) {
    var qs = Object.assign({js_code: req.query.code}, config);
    request.get({
      uri: "https://api.weixin.qq.com/sns/jscode2session",
      qs: qs
    }, function (err, response) {
      if (err) return res.error(err);
      res.send(response.body);
    })
  }
}