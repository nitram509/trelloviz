(function () {
  "use strict";
}());

Trelloviz.TrelloCallbackController = function ($location, $routeParams, TrelloService) {

  TrelloService.authorizeCallback($routeParams.token);
  $location.replace();
  $location.url('/');

}