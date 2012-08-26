/**
 * Trelloviz
 * Copyright 2012 Martin W. Kirst
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

/**
 * Sample usage: <input type="text" data-bind="fadeVisible:myViewmodel" />
 */

if (typeof ko != 'undefined') {
  ko.bindingHandlers.fadeVisible = {
    init:function (element, valueAccessor) {
      // Start visible/invisible according to initial value
      var shouldDisplay = valueAccessor();
      $(element).toggle(shouldDisplay);
    },
    update:function (element, valueAccessor) {
      // On update, fade in/out
      var shouldDisplay = valueAccessor();
      shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
    }
  };
}
