var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var loggedInUser = {email:"abc@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb210"};
var loggedInManufacturer = {email:"spxxx@example.com", password: "123456", realm: "manufacturer", id: "555f0674c0daf6350e2cb211"}
var loggedInAdmin = {email:"gbo2@extensivepro.com", password: "123456", realm: "administrator", id: "555f0674c0daf6350e2cb212"}

describe.skip('Message', function() {
  
  describe('# Manufacturer', function() {

    lt.beforeEach.givenLoggedInUser(loggedInManufacturer);

    lt.describe.whenCalledRemotely('POST', '/api/messages', {
      "ToUserName": loggedInUser.id,
      // "MsgType": "text",
      "Content": "整车厂的公告消息"
    }, function () {
      it('should success publish message', function (done) {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
        done();
      });
    });
    
    describe('## GET', function() {
      var filter = {
        include: ['FromUser'],
        // where: {
        //   "Content": {regex:"a"}
        // },
        limit: 10,
        skip: 0
      }
      var qs = '?'+querystring.stringify({filter: JSON.stringify(filter)})

      lt.describe.whenCalledRemotely('GET', '/api/messages'+qs, function () {
        it('should success get messages', function(done) {
          console.log(this.res.body);
          done();
        });
      });
    });
    
  });
  
  describe('# User', function() {

    lt.beforeEach.givenLoggedInUser(loggedInUser);

    describe('## Create Bike', function() {
      lt.describe.whenCalledRemotely('POST', '/api/bikes', {
        "serialNumber": "010101010101011",
        "brand": {
          "name": "雅迪",
          "id": "552f87315febd5395a773c96",
          "manufacturerId": "552f87145febd5395a773c94"
        },
        "model": "yadi",
        "workmode": 0,
        "voltage": 60,
        "current": 20,
        "localId": "00:03:EE:EE:FF:FF",
        "name": "YL-TEST"
      }, function () {
        it('should ok', function(done) {
          console.log(this.res.body);
          done();
        });
      })
    });
  
    lt.describe.whenCalledByUser(loggedInAdmin, 'POST', '/api/messages', {
      "ToUserName": loggedInUser.id,
      "Content": "平台的公告消息"
    }, function () {
      lt.it.shouldBeAllowed();
    });
    
    describe('### Fetch Message', function() {
      var filter = {
        // include: ['FromUser'],
        where: {
          // and:[{or:[{ToUserName:loggedInAdmin.id}, {FromUserName: loggedInAdmin.id}]}]
        },
        limit: 10,
        skip: 0
      }
      var qs = '?'+querystring.stringify({filter: JSON.stringify(filter)})
      
      lt.describe.whenCalledRemotely('GET', '/api/messages'+qs, function () {
        it('should success', function(done) {
          console.log(this.res.body);
          // console.log(this.res.body[0].message);
          assert.equal(this.res.statusCode, 200);
          done();
        });
      });
    });
    
  });
  
});
