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

  var ConfigStoreService = {
    isLocalStoragaeAvailable: function () {
      return (typeof(Storage) !== "undefined");
    },

    saveApiKey: function (value) {
      if (typeof(Storage) !== "undefined") {
        localStorage.trelloviz_api_key = value;
      }
    },

    loadApiKey: function () {
      if (typeof(Storage) !== "undefined") {
        return localStorage.trelloviz_api_key || '';
      }
      return '';
    },

    saveSessionToken: function (value) {
      if (typeof(Storage) !== "undefined") {
        localStorage.trelloviz_session_token = value;
      }
    },

    loadSessionToken: function () {
      if (typeof(Storage) !== "undefined") {
        return localStorage.trelloviz_session_token || '';
      }
      return '';
    },

    hasApiKey: function () {
      if (typeof(Storage) !== "undefined") {
        if (localStorage.trelloviz_api_key) {
          return localStorage.trelloviz_api_key.trim().length == 32;
        }
      }
      return false;
    }
  }

  Trelloviz.factory('ConfigStoreService', function () {
    return ConfigStoreService;
  });

}());

