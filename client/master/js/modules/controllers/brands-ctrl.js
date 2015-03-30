/**=========================================================
 * Module: brands-ctrl.js
 * Brands Controller
 =========================================================*/

App.controller('BrandsController', function ($scope, Brand, ngTableParams) {
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    getData: function($defer, params) {
      Brand.find({}, $defer.resolve)
    }
  }) 

  Brand.count(function (result) {
    $scope.tableParams.total(result.count)
  })
})

App.controller('BrandsAddController', function ($scope, Brand) {

  $scope.entity = {}
  
  $scope.manufacturers = [{id:123, name:"test"}, {id:456, name:"test2"}]
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formValidate[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      Brand.create($scope.entity)
    } else {
      console.log('Not valid!!');
      return false;
    }
  };
  
})