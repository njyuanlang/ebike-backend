var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring');
var fs = require('fs');

var loggedInUser = {email:"sp@example.com", password: "123456", realm: "manufacturer", manufacturerId: "555f0674c0daf6350e2cb213"};
var manufacturerId = '555f0674c0daf6350e2cb213';
var loggedInAdmin = {email:"gbo@extensivepro.com", password: "123456", realm: "administrator"};

describe('# Manufacturer', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.withUserModel('user');
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  // beforeEach(function () {
  //   console.log(this.loggedInAccessToken)
  // })
  
  describe.only('## Clients', function () {
    var filter = {
      where: {
        "owner.created": {gte:"2015-05-31T16:00:00.000Z"},
        "owner.realm":'client'
      },
      limit: 10,
      skip: 0
    }
    var qs = '?'+querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/bikes/findUsersByManufacturer'+qs, function() {
      lt.it.shouldBeAllowed();
      it('should have statusCode 200', function() {
        assert.equal(this.res.statusCode, 200);
        console.log(this.res.body.length);
      });

      it('should respond with an array of user', function() {
        assert(Array.isArray(this.res.body));
      });
    });
    
    lt.describe.whenCalledRemotely('GET', '/api/bikes/countUserByManufacturer'+qs, function () {
      it('should have statusCode 200', function() {
        assert.equal(this.res.statusCode, 200);
        console.log(this.res.body);
      });
    })
    
    lt.describe.whenCalledRemotely('GET', '/api/bikes/exportUsers?'+querystring.stringify({
      filter: JSON.stringify({
        // limit:100,
        skip:0
      })
    }), function () {
      it('should be ok', function() {
        assert.equal(this.res.statusCode, 200);
        console.log(this.res.headers);
      });
    })
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
    
    describe('### GET ', function() {
      lt.describe.whenCalledRemotely('GET', '/api/brands', function () {
        it('should have statusCode', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });
      
      lt.describe.whenCalledByUser(loggedInAdmin, 'GET', '/api/brands', function () {
        it('should have statusCode', function() {
          // assert.equal(this.res.statusCode, 200);
          console.log(this.res.body)
        });
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "test brand"+Date.now(),
      manufacturerId: manufacturerId
    }, function () {
      it('should have statusCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });

    lt.describe.whenCalledRemotely('PUT', '/api/brands', {
      "name": "updatedName"+Date.now()
    }, function () {
      it('should ok', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/brands', {
      "name": "test brand"+Date.now(),
      manufacturerId: '1234abcd'
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
  
  describe('## Statistic', function () {
    var filter = {
      beginDate: '"2015-04-01"',
      endDate: '"2015-06-01"'
    }
    var qs = '?'+querystring.stringify(filter)
    lt.describe.whenCalledRemotely('GET', '/api/bikes/statRegion'+qs, function () {
      it('should have successCode', function() {
        // console.log(this.res.body)
        assert.equal(this.res.statusCode, 200);
      });
    })
    
    lt.describe.whenCalledRemotely('GET', '/api/tests/stat', function () {
      it('should have successCode', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  })
  
  describe('## Test', function() {
    lt.describe.whenCalledRemotely('GET', '/api/tests', function () {
      it('should have successCode', function() {
        assert.equal(this.res.statusCode, 200);
        // console.log(this.res.body.length)
      });
    })
  });
});