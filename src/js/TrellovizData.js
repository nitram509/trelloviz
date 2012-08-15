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

"use strict"; // jshint ;_;

var TrellovizData = function () {
// placeholder
}

TrellovizData.prototype = {

    listOrderIds:[],
    listOrderNames:[],
    counterPerList:{},
    cardToListMap:{},
    vizDataForJit:{
        'label':[],
        'values':[]
    },

    init:function () {
        this.listOrderIds = [];
        this.listOrderNames = [];
        this.counterPerList = {};
        this.cardToListMap = {};
        this.vizDataForJit = { 'label':[], 'values':[] }
    },

    computeVizData_all_lists:function (trelloActionData) {

        this.init();

        this.sortTrelloDataByDateAscending(trelloActionData);

        for (var idx = 0; idx < trelloActionData.length; idx++) {
            this.processSingleTrelloActionRecord(idx, trelloActionData[idx]);
        }

        this.retrieveLabelNamesFromList();

        this.cleanupNullValues();

        return this.vizDataForJit;
    },

    cleanupNullValues:function () {
        this.vizDataForJit.values.forEach(function (element, index, outerarray) {
                for (var i= 0,len=element.values.length; i<len; i++) {
                    element.values[i] = (element.values[i] || 0);
                }
            },
            this);
    },

    sortTrelloDataByDateAscending:function (trelloActionData) {
        trelloActionData.sort(function (a, b) {
            var unixtimestamp_a = Date.parse(a.date);
            var unixtimestamp_b = Date.parse(b.date);
            if (unixtimestamp_a < unixtimestamp_b) return -1;
            if (unixtimestamp_a > unixtimestamp_b) return 1;
            return 0;
        });
    },

    actionArchiveCard:function (trelloActionRecord) {
        var listid = this.cardToListMap[trelloActionRecord.data.card.id];
        if (listid || false) {
            if (this.counterPerList[listid] <= 0) {
                // there must be one!
                this.counterPerList[listid] = 1;
                var idx = this.listOrderIds.indexOf(listid); // TODO: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
                // also increase all values before
                for (var i = this.vizDataForJit.values.length - 1; i >= 0; i--) {
                    this.vizDataForJit.values[i].values[idx] = (this.vizDataForJit.values[i].values[idx] || 0) + 1;
                }
            }
            this.counterPerList[listid]--;
            return true;
        }
        return false;
    },

    actionCreateCard:function (trelloActionRecord) {
        var listid = trelloActionRecord.data.list.id;
        this.ensureListIsRegistered(trelloActionRecord.data.list);
        this.counterPerList[listid]++;
        this.cardToListMap[trelloActionRecord.data.card.id] = listid;
    },

    ensureListIsRegistered:function (listIdAndName) {
        if (!this.counterPerList[listIdAndName.id]) {
            this.counterPerList[listIdAndName.id] = 0;
            this.listOrderIds.push(listIdAndName.id);
            this.listOrderNames.push(listIdAndName.name);
        }
    },

    actionMoveCard:function (trelloActionRecord) {
        var listidBefore = trelloActionRecord.data.listBefore.id;
        var listidAfter = trelloActionRecord.data.listAfter.id;

        this.ensureListIsRegistered(trelloActionRecord.data.listBefore);
        this.ensureListIsRegistered(trelloActionRecord.data.listAfter);

        if (this.counterPerList[listidBefore] <= 0) {
            // there must be one!
            this.counterPerList[listidBefore] = 1;
            var idx = this.listOrderIds.indexOf(listidBefore); // TODO: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
            // also increase all values before
            for (var i = this.vizDataForJit.values.length - 1; i >= 0; i--) {
                this.vizDataForJit.values[i].values[idx] = (this.vizDataForJit.values[i].values[idx] || 0) + 1;
            }
        }
        this.counterPerList[listidBefore]--;
        this.counterPerList[listidAfter]++;
        this.cardToListMap[trelloActionRecord.data.card.id] = listidAfter;
    },

    processSingleTrelloActionRecord:function (recordIndex, trelloActionRecord) {
        var unixtimestamp = trelloActionRecord.date;

        var validData = false;

        var actions = {};

        var ignoreAction = function() {};

        actions['addMemberToCard'] = ignoreAction;
        actions['removeMemberFromCard'] = ignoreAction;
        actions['addChecklistToCard'] = ignoreAction;
        actions['copyCard'] = ignoreAction;
        actions['updateCheckItemStateOnCard'] = ignoreAction;
        actions['updateBoard'] = ignoreAction;
        actions['commentCard'] = ignoreAction;
        actions['moveCardFromBoard'] = ignoreAction;
        actions['convertToCardFromCheckItem'] = ignoreAction;
        actions['addAttachmentToCard'] = ignoreAction;
        actions['removeChecklistFromCard'] = ignoreAction;
        actions['updateChecklist'] = ignoreAction;

        actions['createList'] = function() {
            this.ensureListIsRegistered(trelloActionRecord.data.list);
        }

        actions['moveCardToBoard'] = function() {
            validData = this.actionArchiveCard(trelloActionRecord);
        }

        actions['createCard'] = function() {
            validData = true;
            this.actionCreateCard(trelloActionRecord);
        }

        actions['updateCard'] = function() {
            if (trelloActionRecord.data.card.closed == true && trelloActionRecord.data.old.closed == false) {
                validData = this.actionArchiveCard(trelloActionRecord);
            }
            if ((trelloActionRecord.data.listAfter || false) && (trelloActionRecord.data.listBefore || false)) {
                validData = true;
                this.actionMoveCard(trelloActionRecord);
            }
        }

        if (actions[trelloActionRecord.type]) {
            actions[trelloActionRecord.type].call(this);
        } else {
            console.error(trelloActionRecord.type);
        }

        if (validData) {
            var valueRowWithNaturalOrder = [];
            for (var i = 0; i < this.listOrderIds.length; i++) {
                var listid = this.listOrderIds[i];
                valueRowWithNaturalOrder.push(this.counterPerList[listid]);
            }
            this.vizDataForJit.values.push(
                {
                    'label':unixtimestamp,
                    'values':valueRowWithNaturalOrder
                }
            );
        }
    },

    retrieveLabelNamesFromList:function () {
        for (var i = 0; i < this.listOrderNames.length; i++) {
            this.vizDataForJit.label.push(this.listOrderNames[i]);
        }
    }
}

