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
