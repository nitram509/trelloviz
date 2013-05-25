(function () {
  "use strict";

  Trelloviz.factory('TrelloService', ['$http', 'ConfigStoreService', function ($http, ConfigStoreService) {

    var _token = '';

    return {

      isLoggedIn: function () {
        return _token.length > 0;
      },

      authorizeCallback: function (token) {
        _token = token;
      }

    };
  }
  ]);

}());

