var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring');

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var clientUser = {email: "13312345678@example.com", username: "13312345678", password:"123456", realm:"client"};

describe('# Discover', function() {
  
  lt.beforeEach.givenLoggedInUser(clientUser);

  describe.only('## Create new one', function() {
    lt.describe.whenCalledRemotely('POST', '/api/pois', {
      "_name": "南京元朗",
      "_location": "118.58883,31.837322",
      // "coordtype": "autonavi",
      "_address": "南京市江宁区飞鹰路8号"
    }, function () {
      // lt.it.shouldBeAllowed();
      it('should have statusCode 200', function () {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
});