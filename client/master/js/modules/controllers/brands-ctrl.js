/**=========================================================
 * Module: brands-ctrl.js
 * Brands Controller
 =========================================================*/

App.controller('BrandsController', function ($scope, Brand, ngTableParams) {
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    total: 12,
    getData: function($defer, params) {
      var count = params.count()
      var skip = (params.page()-1)*count
      Brand.find({filter:{include:"manufacturer", limit:count, skip: skip}}, $defer.resolve)
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
        toaster.pop('success', '新增成功', '已经添加品牌 '+entity.name)
        setTimeout(function () {
          $state.go('app.brands')
        }, 2000)
      }, function (res) {
        toaster.pop('error', '新增错误', res.data.error.message)
        console.log(res)
      })
    } else {
      return false;
    }
  };
  
})

App.controller('BrandController', function ($scope, Brand, $state, toaster, Manufacturer, ngTableParams) {

  $scope.manufacturers = Manufacturer.query()
  $scope.entity = Brand.findById({id:$state.params.brandId})
  $scope.model = ""
  
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formValidate[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      Brand.upsert($scope.entity, function (entity) {
        toaster.pop('success', '更新成功', '已经更新品牌 '+entity.name)
        setTimeout(function () {
          $state.go('app.brands')
        }, 2000)
      }, function (res) {
        toaster.pop('error', '更新错误', res.data.error.message)
      })
    } else {
      return false;
    }
  };
  
  $scope.addNewModel = function () {
    if($scope.model === '') return
    if(!$scope.entity.models) $scope.entity.models = []
    if($scope.entity.models.indexOf($scope.model) >= 0) return
    console.log($scope.entity.models.indexOf($scope.model))
    $scope.entity.models.push($scope.model)
  }
    
})
