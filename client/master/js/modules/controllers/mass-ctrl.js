/**=========================================================
 * Module: mass-ctrl.js
 * Mass Controller
 =========================================================*/

App.controller('MassController', function ($scope, $rootScope, $state, Mass, ngTableParams) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {include: ['FromUser']}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      opt.where = {}
      if($scope.filter.text != '') {
        opt.where.Content = {regex: $scope.filter.text}
      }
      Mass.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
        Mass.find({filter:opt}, function (results) {
          $defer.resolve(results);
        })
      })
    }
  });
  
  $scope.delete = function (mass) {
    Mass.deleteById({id:mass.id}, function () {
      $scope.tableParams.reload();
    });
  }
})

App.controller('MassComposeController', function ($scope, $state, Mass, toaster, ChinaRegion) {
  
  $scope.provinces = ChinaRegion.provinces;
  $scope.region = {
    province: "",
    city: ""
  }
  $scope.submitForm = function () {
    
    Mass.create({
      Content: $scope.content
    }, function (result) {
      toaster.pop('success', '提交成功', "已经向服务器提交了发送请求！");
      setTimeout(function () {
        $state.go('app.mass');
      }, 2000);
    }, function (reaseon) {
      toaster.pop('error', '发送错误', res.data.error.mass);
    })
  }
})