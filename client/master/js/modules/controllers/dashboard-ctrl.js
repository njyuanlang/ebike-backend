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
    var today = moment('2015-04-03', 'YYYY-MM-DD')
    var endDate = today.format('YYYY-MM-DD')
    var beginDate = moment(today).subtract(days, 'days').format('YYYY-MM-DD')

    User.count({where: {created: {gte: endDate}}}, function (result) {
      $scope.statistic.user.added = result.count
    })
    User.count({}, function (result) {
      $scope.statistic.user.total = result.count
    })
    Bike.count({where: {created: {gte: endDate}}}, function (result) {
      $scope.statistic.bike.added = result.count
    })
    Bike.count({}, function (result) {
      $scope.statistic.bike.total = result.count
    })

    User.stat({beginDate: '"'+beginDate+'"', endDate: '"'+endDate+'"'}, function (results) {
      $scope.userData = [{
        label: "新增用户",
        color: "#768294",
        data: []
      }]
      for (var d = 0, i = 0; d < days; d++) {
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
        $scope.userData[0].data.push([day.format('MM/DD'), day2? results[i].count:0])
      }
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
          max: 10,
          tickColor: '#eee',
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickFormatter: function (v) {
              return v/* + ' visitors'*/;
          }
      },
      shadowSize: 0
  };
    
})
