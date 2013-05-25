(function () {
  "use strict";
}());

/* App Module */

var Trelloviz = angular.module('Trelloviz', []);
Trelloviz.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
     when('/config', {templateUrl: 'partials/config.html', controller: ConfigController}).
     when('/', {templateUrl: 'partials/welcome.html'}).
     otherwise({redirectTo: '/'});
}]);
