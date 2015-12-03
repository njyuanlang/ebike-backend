var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('user');

var loggedInUser = {email:"abc@example.com", username:"abc@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb210", region:{province:"江苏", city:"南京"}};
var loggedInUser2 = {email:"def@example.com", username:"def@example.com", password:"123456", realm:"client", id: "555f0674c0daf6350e2cb220", region:{province:"江苏", city:"苏州"}};
var loggedInManufacturer = {email:"spxxx@example.com", password: "123456", realm: "manufacturer", id: "555f0674c0daf6350e2cb211", manufacturerId: "555f0674c0daf6350e2cb213"}
var loggedInAdmin = {email:"gbo2@extensivepro.com", password: "123456", realm: "administrator", id: "555f0674c0daf6350e2cb212"}

var brandId = "555f06dec0daf6350e2cb216";


describe('Statistic', function() {
    
  describe('# Bike', function() {
    // lt.beforeEach.givenLoggedInUser(loggedInAdmin);
    lt.beforeEach.givenLoggedInUser(loggedInManufacturer);
    var filter = {
      groupBy: "owner.region.city",
      where: {
        // "brand.id": brandId
      },
      limit: 10,
      skip: 0
    }
    var qs = '?'+querystring.stringify({filter: JSON.stringify(filter)})
    
    lt.describe.whenCalledRemotely('GET', '/api/bikes/statistic'+qs, function () {
      it('should success stat brand & model', function(done) {
        console.log(this.res.body);
        console.log(this.res.body.data.length);
        assert.equal(this.res.statusCode, 200);
        done();
      });
    });
  });
  
  describe('# Test', function() {
    lt.describe.whenCalledRemotely('GET', '/api/tests/stat', function () {
      it('should have successCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
});