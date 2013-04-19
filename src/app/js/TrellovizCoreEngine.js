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

if (typeof Trelloviz == 'undefined') {
  var Trelloviz = { /* namespace */ };
}

Trelloviz.Core = { /* namespace */ };
Trelloviz.Core.Engine = function (options) {

  options = options || {};
  var _options = {};
  _options.keepArchivedCards = (typeof options.keepArchivedCards != 'undefined') ? options.keepArchivedCards : false;

  function isKeepArchivedCards() {
    return _options.keepArchivedCards;
  }

  return {

    defaultColors:[],
    listOrder:{}, // name:'name', listIdx:0, color:'#abc', id:'123abc'
    counterPerList:{},
    cardToListMap:{},
    vizDataForJit:{
      'label':[],
      'values':[],
      'color':[]
    },

    reset_properties:function () {
      this.defaultColors = ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"];
      this.listOrder = {};
      this.counterPerList = {};
      this.cardToListMap = {};
      this.vizDataForJit = {
        'label':[],
        'values':[],
        'color':[]
      };
    },

    computeVizData_all_lists:function (trelloActionData) {
      this.reset_properties();
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
          for (var i = 0, len = element.values.length; i < len; i++) {
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
      if (isKeepArchivedCards()) return;

      var listid = this.cardToListMap[trelloActionRecord.data.card.id];
      if (listid || false) {
        if (this.counterPerList[listid] <= 0) {
          // there must be one!
          this.counterPerList[listid] = 1;
          var idx = this.listOrder[listid].listIdx;
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
      if (!this.listOrder[listIdAndName.id]) {
        this.counterPerList[listIdAndName.id] = 0;
        var listIdx = this.sizeOfObject(this.listOrder);
        this.listOrder[listIdAndName.id] = {name:listIdAndName.name, id:listIdAndName.id, listIdx:listIdx, color:this.defaultColors[listIdx % this.defaultColors.length]};
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
        var idx = this.listOrder[listidBefore].listIdx;
        // also increase all values before
        var i = Math.max(0, this.vizDataForJit.values.length - 1);
        while (i--) {
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

      var ignoreAction = function () {
      };

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
      actions['createBoard'] = ignoreAction;
      actions['addMemberToBoard'] = ignoreAction;

      actions['createList'] = function () {
        this.ensureListIsRegistered(trelloActionRecord.data.list);
      }

      actions['moveCardToBoard'] = function () {
        validData = this.actionArchiveCard(trelloActionRecord);
      }

      actions['createCard'] = function () {
        validData = true;
        this.actionCreateCard(trelloActionRecord);
      }

      actions['updateCard'] = function () {
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
        console.error("missing action, not handled: " + trelloActionRecord.type);
      }

      if (validData) {
        this.vizDataForJit.values.push(
          {
            label:unixtimestamp,
            values:this.retrieveValueRowWithNaturalOrder()
          }
        );
      }
    },

    retrieveValueRowWithNaturalOrder:function () {
      var valueRowWithNaturalOrder = [];
      for (var listid in this.listOrder) {
        var idx = this.listOrder[listid].listIdx;
        valueRowWithNaturalOrder[idx] = this.counterPerList[listid];
      }
      return valueRowWithNaturalOrder;
    },

    retrieveListsWithNaturalOrder:function () {
      var listsWithNaturalOrder = [];
      for (var listid in this.listOrder) {
        var idx = this.listOrder[listid].listIdx;
        listsWithNaturalOrder[idx] = this.listOrder[listid];
      }
      return listsWithNaturalOrder;
    },

    retrieveLabelNamesFromList:function () {
      for (var listid in this.listOrder) {
        var idx = this.listOrder[listid].listIdx;
        this.vizDataForJit.label[idx] = this.listOrder[listid].name;
        this.vizDataForJit.color[idx] = this.defaultColors[idx % this.defaultColors.length];
      }
    },

    sizeOfObject:function (hashmap) {
      var i = 0;
      for (var key in hashmap) if (hashmap.hasOwnProperty(key))i++;
      return i;
    }

  };

};
