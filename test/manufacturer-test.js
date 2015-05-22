var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"yd@example.com", password: "123456", realm: "manufacturer"}

describe('# Manufacturer', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  

  describe('## Clients', function () {
    var filter = {
      limit: 5,
      skip: 5
    }
    var qs = '?'+querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/bikes/findUsersByManufacturer'+qs, function() {
      lt.it.shouldBeAllowed();
      it('should have statusCode 200', function() {
        assert.equal(this.res.statusCode, 200);
        console.log(this.res.body, this.res.body.length);
      });

      it('should respond with an array of user', function() {
        assert(Array.isArray(this.res.body));
      });
    });
  });

  describe('## Bikes', function () {

    lt.describe.whenCalledRemotely('GET', '/api/bikes', function () {
      lt.it.shouldBeAllowed();
      it('should have statusCode 200', function () {
        assert.equal(this.res.statusCode, 200);
        // console.log(this.res.body.length);
      });
    });
  });
  
  describe('## Brands', function () {
    
    lt.describe.whenCalledRemotely('GET', '/api/brands', function () {
      it('should have statusCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "test brand"+Date.now(),
      manufacturerId: '552f87015febd5395a773c93'
    }, function () {
      it('should have statusCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "updatedName"+Date.now()
    }, function () {
      it('should ok', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "test brand"+Date.now(),
      manufacturerId: '555af68dd5dcc0bdbcbfb8c5'
    }, function () {
      lt.it.shouldBeDenied();
    })
  })
  
  describe('## Dashboard', function () {
    lt.describe.whenCalledRemotely('GET', '/api/bikes/stat', function () {
      it('should have successCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  })
  
  describe.only('## Statistic', function () {
    var filter = {
      beginDate: '"2015-04-01"',
      endDate: '"2015-05-01"'
    }
    var qs = '?'+querystring.stringify(filter)
    lt.describe.whenCalledRemotely('GET', '/api/bikes/statRegion'+qs, function () {
      it('should have successCode', function() {
        console.log(this.res.body)
      });
    })
  })
});