var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var loggedInUser = {email:"abc@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb210"};
var loggedInManufacturer = {email:"spxxx@example.com", password: "123456", realm: "manufacturer", id: "555f0674c0daf6350e2cb211"}
var loggedInAdmin = {email:"gbo2@extensivepro.com", password: "123456", realm: "administrator", id: "555f0674c0daf6350e2cb212"}

describe('Bike', function() {
  
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe.only('#Create', function() {
    lt.describe.whenCalledRemotely('POST', '/api/bikes', {
      "serialNumber": "010101010101011",
      "brand": {
        "name": "尚品",
        "id": "555f06dec0daf6350e2cb216",
        "manufacturerId": "555f0674c0daf6350e2cb213"
      },
      "model": "sp-1",
      "workmode": 0,
      "voltage": 60,
      "current": 20,
      "localId": "00:03:EE:EE:FF:FF",
      "name": "YL-TEST"
    }, function () {
      it('should success', function (done) {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
        done();
      });
    });
  });
});