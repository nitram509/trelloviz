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

"requires jQuery"; // just a hint ;-)
"use strict"; // jshint ;_;

var TrellovizData = function () {
// placeholder
}

TrellovizData.prototype = {

    computeVizData_all_lists:function (trelloData) {

        trelloData.sort(function (a, b) {
            var unixtimestamp_a = Date.parse(a.date);
            var unixtimestamp_b = Date.parse(b.date);
            if (unixtimestamp_a < unixtimestamp_b) return -1;
            if (unixtimestamp_a > unixtimestamp_b) return 1;
            return 0;
        });

        var listOrderIds = [];
        var listOrderNames = [];
        var counterPerList = {};
        var cardToListMap = {};
        var vizDataForJit = {
            'label':[],
            'values':[]
        };

        $.each(trelloData, function (idx, trelloAction) {
            var unixtimestamp = trelloAction.date;

            var validData = true;

            if (trelloAction.type == 'createCard') {
                var listid = trelloAction.data.list.id;
                if (!counterPerList[listid]) {
                    listOrderIds.push(listid);
                    listOrderNames.push(trelloAction.data.list.name);
                }
                counterPerList[listid] = (counterPerList[listid] || 0) + 1;
                cardToListMap[trelloAction.data.card.id] = listid;
            } else if (trelloAction.type == 'updateCard') {
                if (trelloAction.data.card.closed == true && trelloAction.data.old.closed == false) {
                    // card archived
                    counterPerList[cardToListMap[trelloAction.data.card.id]]--;
                }
                if (typeof trelloAction.data.listAfter != "undefined"
                    && trelloAction.data.listBefore != "undefined"
                    && trelloAction.data.listAfter.id != trelloAction.data.listBefore.id) {
                    // verschoben
                    counterPerList[trelloAction.data.listAfter.id]++;
                    counterPerList[trelloAction.data.listBefore.id]--;
                }
            } else {
                validData = false;
                console.error(trelloAction.type);
            }

            if (validData) {
                var retrievevalues = function () {
                    var result = [];
                    $.each(listOrderIds, function (idx, listid) {
                        result.push(counterPerList[listid]);
                    });
                    return result;
                };
                vizDataForJit.values.push(
                    {
                        'label':unixtimestamp,
                        'values':retrievevalues()
                    }
                );
            }
        });

        for (var i=0; i<listOrderNames.length; i++) {
            vizDataForJit.label.push(listOrderNames[i]);
        }

        return vizDataForJit;
    }

}

