/**=========================================================
 * Module: dashboard-ctrl.js
 * Dashboard Controllers
 =========================================================*/

App.controller('DashboardController', function ($scope, User, Bike, ngTableParams) {
  
  $scope.statistic = {
    user: {added: 0, total: 0},
    bike: {added: 0, total: 0}
  }
  
  $scope.stat = function () {
    var now = new Date()
    var today = new Date(now.getFullYear(), 2, 25)
    console.log(today)
    User.count({where: {created: {gte: today}}}, function (result) {
      $scope.statistic.user.added = result.count
    })
    User.count({}, function (result) {
      $scope.statistic.user.total = result.count
    })
    Bike.count({where: {created: {gt: today}}}, function (result) {
      $scope.statistic.bike.added = result.count
    })
    Bike.count({}, function (result) {
      $scope.statistic.bike.total = result.count
    })

    User.stat({beginDate: '"2015-01-01"', endDate: '"2015-04-15"'}, function (result) {
      $scope.userData = [{
        label: "新增用户",
        color: "#768294",
        data: []
      }]
      result.forEach(function (item) {
        $scope.userData[0].data.push([item._id.month+'/'+item._id.dayOfMonth, item.count])
      })
    })
  }
  
  $scope.stat()
  
  $scope.splineOptions = {
      series: {
          lines: {
              show: false
          },
          points: {
              show: true,
              radius: 4
          },
          splines: {
              show: true,
              tension: 0.4,
              lineWidth: 1,
              fill: 0.5
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: function (label, x, y) { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#fcfcfc',
          mode: 'categories'
      },
      yaxis: {
          min: 0,
          max: 100,
          tickColor: '#eee',
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickFormatter: function (v) {
              return v/* + ' visitors'*/;
          }
      },
      shadowSize: 0
  };
    
})
