/**=========================================================
 * Module: Mass filters.js
 * Mass filter
 =========================================================*/

App.filter("mass_filter", function ($filter) {
  return function (input) {
    if(input && input.region){ 
      var desc = input.region.province;
      desc += input.region.city||'';
      return desc+"用户";
    };
    return "全部用户";
  }
});

