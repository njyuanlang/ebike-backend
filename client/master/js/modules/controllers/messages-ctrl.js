/**=========================================================
 * Module: messages-ctrl.js
 * Messages Controller
 =========================================================*/

App.controller('MessagesController', function ($scope, Message, ngTableParams, RemoteStorage, $http) {
  
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
      Message.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
        Message.find({filter:opt}, function (results) {
          results.forEach(function (msg) {
            var url = RemoteStorage.getDownloadURL('uploads', msg.FromUserName, 'avatar.png');
            msg.avatar = 'app/img/dummy.png';
            $http.get(url).success(function (buffer) {
              msg.avatar = buffer;
            });
          });
          $defer.resolve(results);
        })
      })
    }
  });
})