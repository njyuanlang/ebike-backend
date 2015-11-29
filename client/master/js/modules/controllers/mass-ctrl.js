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

App.controller('MassComposeController', function ($scope, $state, Mass, toaster) {
  
  AMap.service('AMap.DistrictSearch', function () {
    var districtSearch = new AMap.DistrictSearch({
      level : 'country',
      subdistrict : 2    
    });
    
    districtSearch.search('中国', function (status, result) {
      $scope.provinces = result.districtList[0].districtList;
      $scope.$apply();
    });
  });
  $scope.region = {
    province: "",
    city: ""
  }
  $scope.submitForm = function () {
    var massBody = {
      where: {},
      Content: $scope.content
    };
    if($scope.region){
      if($scope.region.province && $scope.region.province !== "") {
        massBody.where.region = {
          province: $scope.region.province.name
        };
      }
      if($scope.region.city && $scope.region.city !== "") {
        var city = $scope.region.city.name;
        if(city.match(/市辖区$/m)){
          massBody.where.region.city = city.substr(0, city.length-3);          
        } else {
          massBody.where.region.city = city;
        }
      } 
    }
    Mass.create(massBody, function (result) {
      toaster.pop('success', '提交成功', "已经向服务器提交了发送请求！");
      setTimeout(function () {
        $state.go('app.mass');
      }, 2000);
    }, function (reaseon) {
      toaster.pop('error', '发送错误', res.data.error.mass);
    })
  }
})