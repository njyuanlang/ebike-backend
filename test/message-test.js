var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var loggedInUser = {email:"abc@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb210"};
var loggedInManufacturer = {email:"sp@example.com", password: "123456", realm: "manufacturer", id: "555f0674c0daf6350e2cb211"}
var loggedInAdmin = {email:"gbo@extensivepro.com", password: "123456", realm: "administrator", id: "555f0674c0daf6350e2cb212"}

describe('Message', function() {
  
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
    
    lt.describe.whenCalledByUser(loggedInUser, 'GET', '/api/messages/chats', function () {
      it('should success get messages from User', function(done) {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
        done();
      });
    });
        
    describe.only('## GET', function() {
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
  
});