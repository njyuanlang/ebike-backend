/**=========================================================
 * Module: clients-ctrl.js
 * Clients Controller
 =========================================================*/

App.controller('ClientsController', function ($scope, $state, User, ngTableParams, $rootScope, RemoteStorage) {
  
  $scope.filter = {text: ''}
  $scope.tableParams = new ngTableParams({
    count: 10,
    filter: $scope.filter.text
  }, {
    getData: function($defer, params) {
      var opt = {order: 'created DESC'}
      opt.limit = params.count()
      opt.skip = (params.page()-1)*opt.limit
      opt.where = {realm: "client"}
      if($scope.filter.text != '') {
        opt.where['username'] = {regex: $scope.filter.text}
      }
      User.count({where: opt.where}, function (result) {
        $scope.tableParams.total(result.count)
        User.find({filter:opt}, function (results) {
          results.forEach(function (user) {
            user.avatar = 'app/img/dummy.png';
            RemoteStorage.getAvatar(user.id).success(function (buffer) {
              user.avatar = buffer;
            });
          })
          $defer.resolve(results);
        })
      })
    }
  });
  
  $scope.reply = function (user) {
    $rootScope.messageDraft = {
      touser: user
    }
    $state.go('app.message-compose');
  }
  
  $scope.generate = function () {
    $http.get(urlBase+'/users/export?access_token='+LoopBackAuth.accessTokenId, {
      responseType: 'arraybuffer'
    })
      .success(function (data, status, headers, config) {
        var blob = new Blob([data], {
          type: 'text/csv;charset=GBK;'
        });
        var downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
        var downloadLink = angular.element(downloadContainer.children()[0]);
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', $scope.user.email+Date.now()+'.csv');
        downloadLink.attr('target', '_blank');

        $document.find('body').append(downloadContainer);
        $timeout(function () {
          downloadLink[0].click();
          downloadLink.remove();
        }, null);
      });
  }
})