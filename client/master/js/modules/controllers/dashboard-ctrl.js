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
    var days = 15
    var today = moment().endOf('day')
    var startOfDay = moment().startOf('day')
    var beginDate = moment().subtract(days, 'days').startOf('day')

    User.count({where: {created: {gte: startOfDay}, realm: 'client' }}, function (result) {
      $scope.statistic.user.added = result.count
    })
    User.count({where: {realm: 'client' }}, function (result) {
      $scope.statistic.user.total = result.count
    })
    Bike.count({where: {created: {gte: startOfDay}}}, function (result) {
      $scope.statistic.bike.added = result.count
    })
    Bike.count({}, function (result) {
      $scope.statistic.bike.total = result.count
    })
    
    var userData = null
    var bikeData = null
    User.stat({filter:{where:{created: {between: [beginDate, today]}, realm: 'client' }}}, function (results) {
      userData = {
        label: "新增用户",
        color: "#768294",
        data: []
      }
      for (var d = 1, i = 0; d <= days; d++) {
        var day = moment(today).subtract(days-d, 'days')
        var day2 = null
        while(i < results.length) {
          day2 = moment(results[i]._id.year+'-'+results[i]._id.month+'-'+results[i]._id.dayOfMonth, 'YYYY-MM-DD')
          if(day.isBefore(day2, 'day')) {
            day2 = null
            break;
          } else if(day.isSame(day2, 'day')) {
            break
          } else {
            day2 = null
            i++
          }
        }
        userData.data.push([day.format('MM/DD'), day2? results[i].count:0])
      }
      if(userData && bikeData) {
        $scope.chartData = [userData, bikeData]
      }
    })
    Bike.stat({filter:{where:{created: {between: [beginDate, today]}}}}, function (results) {
      bikeData = {
        label: "新增车辆",
        color: "#1f92fe",
        data: []
      }
      for (var d = 1, i = 0; d <= days; d++) {
        var day = moment(today).subtract(days-d, 'days')
        var day2 = null
        while(i < results.length) {
          day2 = moment(results[i]._id.year+'-'+results[i]._id.month+'-'+results[i]._id.dayOfMonth, 'YYYY-MM-DD')
          if(day.isBefore(day2, 'day')) {
            day2 = null
            break;
          } else if(day.isSame(day2, 'day')) {
            break
          } else {
            day2 = null
            i++
          }
        }
        bikeData.data.push([day.format('MM/DD'), day2? results[i].count:0])
      }
      if(userData && bikeData) {
        $scope.chartData = [userData, bikeData]
      }
    })
  }
  
  $scope.stat()
  
  $scope.lineOptions = {
      series: {
          lines: {
              show: true,
              fill: 0.01
          },
          points: {
              show: true,
              radius: 4
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
          tickColor: '#eee',
          mode: 'categories'
      },
      yaxis: {
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickColor: '#eee'
      },
      shadowSize: 0
  };
    
})
