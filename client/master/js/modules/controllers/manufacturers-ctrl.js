/**=========================================================
 * Module: manufacturers-ctrl.js
 * Manufacturers Controller
 =========================================================*/

App.controller('ManufacturersController', function ($scope, Manufacturer, ngTableParams) {
  
  $scope.tableParams = new ngTableParams({
    count: 10
  }, {
    getData: function($defer, params) {
      Manufacturer.find({}, $defer.resolve)
    }
  }) 

  Manufacturer.count(function (result) {
    $scope.tableParams.total(result.count)
  })
})

App.controller('ManufacturersAddController', function ($scope, $state, Manufacturer, toaster) {

  $scope.entity = {}
  
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formValidate[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      Manufacturer.create($scope.entity, function (entity) {
        toaster.pop('success', '新增制造商成功', '已经添加制造商 '+entity.name)
        setTimeout(function () {
          $state.go('app.manufacturers')
        }, 2000)
      }, function (res) {
        toaster.pop('error', '新增制造商错误', res.data.error.message)
        console.log(res)
      })
    } else {
      return false;
    }
  };
  
})