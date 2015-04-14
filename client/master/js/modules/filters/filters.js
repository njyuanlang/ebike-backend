/**=========================================================
 * Module: filters.js
 * Common userful filter
 =========================================================*/

App.filter("percentage", function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals || 0) + '%';
  }
})