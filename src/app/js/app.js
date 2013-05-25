(function () {
  "use strict";
}());

var Trelloviz = angular.module('Trelloviz', []);
Trelloviz.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
     when('/config', {templateUrl: 'partials/config.html', controller: 'Trelloviz.ConfigController'}).
     when('/', {templateUrl: 'partials/welcome.html'}).
     otherwise({redirectTo: '/'});
}]);
