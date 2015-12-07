/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';

  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // default route
  $urlRouterProvider.otherwise('/page/login');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController',
        resolve: helper.resolveFor('modernizr', 'icons', 'toaster', 'ngTable', 'moment')
    })
    .state('app.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        controller: 'DashboardController',
        templateUrl: helper.basepath('dashboard.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.mass', {
        url: '/mass',
        title: 'Mass',
        controller: 'MassController',
        templateUrl: helper.basepath('mass.html')
    })
    .state('app.mass-compose', {
        url: '/mass/compose?touser',
        title: 'Mass Compose',
        controller: 'MassComposeController',
        templateUrl: helper.basepath('mass-compose.html'),
        resolve: helper.resolveFor('angularjs-region')
    })
    .state('app.messages', {
        url: '/messages',
        title: 'Messages',
        controller: 'MessagesController',
        templateUrl: helper.basepath('messages.html')
    })
    .state('app.message-compose', {
        url: '/messages/compose?touser',
        title: 'Message Compose',
        controller: 'MessageComposeController',
        templateUrl: helper.basepath('message-compose.html')
    })
    .state('app.merchants', {
        url: '/merchants',
        title: 'Merchants',
        controller: 'MerchantsController',
        templateUrl: helper.basepath('merchants.html'),
        resolve: helper.resolveFor('ngTableExport')
    })
    .state('app.clients', {
        url: '/clients',
        title: 'Clients',
        controller: 'ClientsController',
        templateUrl: helper.basepath('clients.html'),
        resolve: helper.resolveFor('ngTableExport')
    })
    .state('app.bikes', {
        url: '/bikes',
        title: 'Bikes',
        controller: 'BikesController',
        templateUrl: helper.basepath('bikes.html')
    })
    .state('app.cruises', {
        url: '/cruises',
        title: 'Cruises',
        controller: 'CruisesController',
        templateUrl: helper.basepath('cruises.html')
    })
    .state('app.tests', {
        url: '/tests',
        title: 'Tests',
        controller: 'TestsController',
        templateUrl: helper.basepath('tests.html')
    })
    .state('app.manufacturers', {
        url: '/manufacturers',
        title: 'Manufacturers',
        controller: 'ManufacturersController',
        templateUrl: helper.basepath('manufacturers.html')
    })
    .state('app.manufacturers-add', {
        url: '/manufacturers-add',
        title: 'Manufacturers',
        templateUrl: helper.basepath('manufacturers-add.html')
    })
    .state('app.brands', {
        url: '/brands',
        title: 'Brands',
        controller: 'BrandsController',
        templateUrl: helper.basepath('brands.html')
    })
    .state('app.brands-add', {
        url: '/brands-add',
        title: 'Brands Add',
        templateUrl: helper.basepath('brands-add.html')
    })
    .state('app.brand', {
        url: '/brands/:brandId',
        title: 'Brands detail',
        templateUrl: helper.basepath('brand.html')
    })
    .state('app.devices', {
        url: '/devices',
        title: 'Devices',
        controller: 'DevicesController',
        templateUrl: helper.basepath('devices.html')
    })
    .state('app.statistic-brand', {
        url: '/statistic-brand',
        title: 'Statistic Brand',
        controller: 'StatisticBrandController',
        templateUrl: helper.basepath('statistic-brand.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.statistic-region', {
        url: '/statistic-region',
        title: 'Statistic Region',
        controller: 'StatisticRegionController',
        templateUrl: helper.basepath('statistic-region.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.statistic-fault', {
        url: '/statistic-fault',
        title: 'Statistic Fault',
        controller: 'StatisticFaultController',
        templateUrl: helper.basepath('statistic-fault.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'angularjs-region')
    })
    .state('app.accounts', {
        url: '/accounts',
        title: 'Accounts',
        controller: 'AccountsController',
        templateUrl: helper.basepath('accounts.html')
    })
    .state('app.accounts-add', {
        url: '/accounts-add',
        title: 'Accounts Add',
        templateUrl: helper.basepath('accounts-add.html')
    })
    .state('app.account', {
        url: '/accounts/:accountId',
        title: 'Account',
        templateUrl: helper.basepath('account.html')
    })
    // 
    // Single Page Routes
    // ----------------------------------- 
    .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        resolve: helper.resolveFor('modernizr', 'icons', 'ebike-services'),
        controller: function($rootScope) {
            $rootScope.app.layout.isBoxed = false;
        }
    })
    .state('page.login', {
        url: '/login',
        title: "Login",
        templateUrl: 'app/pages/login.html'
    })
    .state('page.recover', {
        url: '/recover',
        title: "Recover",
        templateUrl: 'app/pages/recover.html'
    })
    ;


}]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
      'use strict';
      // registering components after bootstrap
      App.controller = $controllerProvider.register;
      App.directive  = $compileProvider.directive;
      App.filter     = $filterProvider.register;
      App.factory    = $provide.factory;
      App.service    = $provide.service;
      App.constant   = $provide.constant;
      App.value      = $provide.value;

}]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('zh_CN');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).config(['$tooltipProvider', function ($tooltipProvider) {

    $tooltipProvider.options({appendToBody: true});

}])
// .constant('urlBase', "http://0.0.0.0:3000/api")
.constant('urlBase', "http://121.40.108.30:3000/api")
.config(function(LoopBackResourceProvider, urlBase) {
    LoopBackResourceProvider.setUrlBase(urlBase);
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
    return {
      responseError: function(rejection) {
        if (rejection.status == 401) {
          LoopBackAuth.clearUser();
          LoopBackAuth.clearStorage();
          $location.path('/page/login')
        }
        return $q.reject(rejection);
      }
    };
  });
})
;