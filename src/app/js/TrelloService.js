/**
 * Trelloviz
 * Copyright 2013 Martin W. Kirst
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function () {
  "use strict";

  Trelloviz.factory('TrelloService', ['$http', 'ConfigStoreService', function ($http, ConfigStoreService) {

    var _token = ConfigStoreService.loadSessionToken();

    (function resetAngularJS_HTTP_defaultHeaderToMake_CORS_work() {
      delete $http.defaults.headers.common['X-Requested-With'];
    })();

    var TrelloService = {

      isLoggedIn: function () {
        return _token.length > 0;
      },

      authorizeCallback: function (token) {
        ConfigStoreService.saveSessionToken(token);
        _token = token;
      },

      getTokenMemberInfo: function (successCallback) {
        var url = "https://api.trello.com/1/tokens/" + _token + "/member";
        var config = {
          params: {
            'key': ConfigStoreService.loadApiKey()
          }
        };
        $http.get(url, config).
           success(function (data, status, headers, config) {
//             successCallback(data);
             console.info("SUCCESS" + data);
           }).
           error(function (data, status, headers, config) {
             // called asynchronously if an error occurs
             // or server returns response with an error status.
           });
      }
    };

    return TrelloService;
  }]);

}());

