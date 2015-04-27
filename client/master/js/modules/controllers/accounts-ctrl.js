/**=========================================================
 * Module: accounts-ctrl.js
 * Accounts Controller
 =========================================================*/

App.controller('AccountsController', function ($scope, User, ngTableParams) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      opt.where = {realm: "administrator"}
      if($scope.filter.text != '') {
        opt.where.name = {like: $scope.filter.text}
      }
      User.find({filter:opt}, $defer.resolve)
      User.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
      })
    }
  })   
})

App.controller('AccountsAddController', function ($scope, User, $state, toaster) {

  $scope.entity = {realm:'administrator'}
  
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formValidate[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      $scope.entity.username = $scope.entity.email
      User.create($scope.entity, function (entity) {
        toaster.pop('success', '新增成功', '已经添加帐号 '+entity.name)
        setTimeout(function () {
          $state.go('app.accounts')
        }, 2000)
      }, function (res) {
        toaster.pop('error', '新增错误', res.data.error.message)
      })
    } else {
      return false;
    }
  };
  
})

App.controller('AccountController', function ($scope, User, $state, toaster) {

  $scope.entity = User.findById({id: $state.params.accountId})
  
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formValidate[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  // Submit form
  $scope.submitForm = function() {
    $scope.submitted = true;
    if ($scope.formValidate.$valid) {
      User.upsert($scope.entity, function (entity) {
        toaster.pop('success', '更新成功', '已经更新帐号 '+entity.name)
        setTimeout(function () {
          $state.go('app.accounts')
        }, 2000)
      }, function (res) {
        toaster.pop('error', '更新错误', res.data.error.message)
      })
    } else {
      return false;
    }
  };
  
})