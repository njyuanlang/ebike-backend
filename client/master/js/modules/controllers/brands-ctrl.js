/**=========================================================
 * Module: brands-ctrl.js
 * Brands Controller
 =========================================================*/

App.controller('BrandsController', function ($scope, Brand, ngTableParams) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {order: 'created DESC', include:"manufacturer"}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      if($scope.filter.text != '') {
        opt.where = {"name": {like: $scope.filter.text}}
      }
      Brand.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
        Brand.find({filter:opt}, $defer.resolve)
      })
    }
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

  var goBack = function (delay) {
    setTimeout(function () {
      $state.go('app.brands')
    }, delay || 2000);
  };
  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      Brand.upsert($scope.entity, function (entity) {
        toaster.pop('success', '更新成功', '已经更新品牌 '+entity.name);
        goBack();
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
    $scope.entity.models.push($scope.model)
  }
  
  $scope.remove = function () {
    Brand.prototype$updateAttributes({id: $scope.entity.id}, {"status": 'removed'}).$promise
    .then(function (entity) {
      toaster.pop('success', '删除成功', '已经删除品牌 '+entity.name);
      goBack();
    }, function (err) {
      toaster.pop('error', '删除失败', '未成功删除品牌');
    });
  }
    
})
