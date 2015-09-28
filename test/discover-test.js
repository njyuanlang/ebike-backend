var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring');

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var clientUser = {email: "13312345678@example.com", username: "13312345678", password:"123456", realm:"client"};

describe('# Discover', function() {
  
  lt.beforeEach.givenLoggedInUser(clientUser);

  describe('## Create new one', function() {
    lt.describe.whenCalledRemotely('POST', '/api/pois', {
      "_name": "测试地址",
      "_location": "118.786331,31.936223",
      "_address": "将军大道2919^-210",
      "anybrand": 1,
      "charge": 1,
      "onsite": 0,
      "wheel2": 1,
      "wheel3": 1,
      "province": "江苏省",
      "city": "南京市",
      "district": "江宁区",
      "telephone": "12345678936"
    }, function () {
      // lt.it.shouldBeAllowed();
      it('should have statusCode 200', function () {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
});