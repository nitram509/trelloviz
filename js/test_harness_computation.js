/**
 Trelloviz
 Copyright 2012 Martin W. Kirst

 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//var vizTimestamps = [];
//var vizPlan = [];
//var vizWiP = [];
//var vizDone = [];
//
//var idPlan = "500daadf637e1efe2a2348fa";
//var idWiP = "500daadf637e1efe2a2348fb";
//var idDone = "500daadf637e1efe2a2348fc";
//
//var counterPerList = {};
//var cardToListMap = {};
//
//counterPerList[idPlan] = 0;
//counterPerList[idWiP] = 0;
//counterPerList[idDone] = 0;
//
//data.sort(function (a, b) {
//    var unixtimestamp_a = Date.parse(a.date);
//    var unixtimestamp_b = Date.parse(b.date);
//    if (unixtimestamp_a < unixtimestamp_b) return -1;
//    if (unixtimestamp_a > unixtimestamp_b) return 1;
//    return 0;
//});
//
//$.each(data, function (idx, trelloAction) {
//    console.info(trelloAction.date);
//    var unixtimestamp = trelloAction.date;// Date.parse(trelloAction.date);
//    console.info(new Date(unixtimestamp));
//
//    if (trelloAction.type == 'createCard') {
//        counterPerList[trelloAction.data.list.id]++;
//        cardToListMap[trelloAction.data.card.id] = trelloAction.data.list.id;
//    } else if (trelloAction.type == 'updateCard') {
//        if (trelloAction.data.card.closed == true && trelloAction.data.old.closed == false) {
//            counterPerList[cardToListMap[trelloAction.data.card.id]]--;
//        }
//        if (typeof trelloAction.data.listAfter != "undefined"
//            && trelloAction.data.listBefore != "undefined"
//            && trelloAction.data.listAfter.id != trelloAction.data.listBefore.id) {
//            // verschoben
//            counterPerList[trelloAction.data.listAfter.id]++;
//            counterPerList[trelloAction.data.listBefore.id]--;
//        }
//    } else {
//        console.info(trelloAction.type);
//    }
//
//    vizTimestamps.push(unixtimestamp);
//    vizPlan.push(counterPerList[idPlan]);
//    vizWiP.push(counterPerList[idWiP]);
//    vizDone.push(counterPerList[idDone]);
//
//});
//
//var viz_data = {
//    'label':['ToDo', 'WiP', 'Done'],
//    'values':[]
//};
//for (var i=0; i<vizTimestamps.length; i++) {
//    viz_data.values.push(
//            {
//                'label':vizTimestamps[i],
//                'values': [vizPlan[i], vizWiP[i], vizDone[i]]
//            }
//    );
//};
