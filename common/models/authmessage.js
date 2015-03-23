var https = require('https');
var querystring = require('querystring');
    
module.exports = function(Authmessage) {
  
  Authmessage.beforeCreate = function (next, authmessage) {
    var now = Date.now()
    authmessage.created = now
    authmessage.code = now%10000
    
    var postData = {
      mobile: authmessage.phone,
      message: "验证码："+authmessage.code+" 在2分钟内有效【帮大师】"
    }
    
    var content = querystring.stringify(postData);
    
    var options = {
      host:'sms-api.luosimao.com',
      path:'/v1/send.json',
      method:'POST',
      auth:'api:key-8b8ccfdd0262d99f3c72f407a6b784e9',
      agent:false,
      rejectUnauthorized : false,
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded', 
        'Content-Length' :content.length
      }
    };

    var error = null
    var req = https.request(options,function(res){
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        var result = JSON.parse(chunk)
        if(result.error != 0) {
          error = new Error(result.msg)
          error.status = 400
        }
      });
      res.on('end',function(){
        if(error) return next(error)
        next()
      });
    });

    req.write(content);
    req.end();
    // next()
  }

};
