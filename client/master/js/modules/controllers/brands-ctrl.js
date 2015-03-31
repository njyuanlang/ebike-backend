/**=========================================================
 * Module: brands-ctrl.js
 * Brands Controller
 =========================================================*/

App.controller('BrandsController', function ($scope, Brand, ngTableParams) {
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    getData: function($defer, params) {
      Brand.find({include:['manufacturer']}, $defer.resolve)
    }
  }) 

  Brand.count(function (result) {
    $scope.tableParams.total(result.count)
  })
})

App.controller('BrandsAddController', function ($scope, Brand, $state, toaster, Manufacturer) {

  $scope.entity = {}
  
  $scope.manufacturers = Manufacturer.query()
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formValidate[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      Brand.create($scope.entity, function (entity) {
        toaster.pop('success', '新增品牌成功', '已经添加品牌 '+entity.name)
        setTimeout(function () {
          $state.go('app.brands')
        }, 2000)
      }, function (res) {
        toaster.pop('error', '新增品牌错误', res.data.error.message)
        console.log(res)
      })
    } else {
      return false;
    }
  };
  
})