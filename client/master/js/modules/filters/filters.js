/**=========================================================
 * Module: filters.js
 * Common userful filter
 =========================================================*/

App.filter("percentage", function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals || 0) + '%';
  }
});

App.filter("moment", function () {
  return function (input, format) {
    return moment(input).format(format || 'YYYY-MM-DD HH:mm:ss');
  }
});

App.filter("moment_unix", function () {
  return function (input, format) {
    return moment.unix(input).format(format || 'YYYY-MM-DD HH:mm:ss');
  }
});

App.filter("merchant_ability", function () {
  var dictionary = {
    "anybrand": "维修任意品牌",
    "charge": "充电",
    "onsite": "5公里内上门服务",
    "wheel2": "修2轮车",
    "wheel3": "修3轮车"
  }
  return function (key) {
    return dictionary[key]
  }
});
