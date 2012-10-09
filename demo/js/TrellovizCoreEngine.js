if("undefined"==typeof Trelloviz)var Trelloviz={};Trelloviz.Core={};
Trelloviz.Core.Engine=function(g){var g=g||{},h;h="undefined"!=typeof g.keepArchivedCards?g.keepArchivedCards:!1;return{defaultColors:[],listOrder:{},counterPerList:{},cardToListMap:{},vizDataForJit:{label:[],values:[],color:[]},reset_properties:function(){this.defaultColors="#416D9C #70A35E #EBB056 #C74243 #83548B #909291 #557EAA".split(" ");this.listOrder={};this.counterPerList={};this.cardToListMap={};this.vizDataForJit={label:[],values:[],color:[]}},computeVizData_all_lists:function(b){this.reset_properties();
this.sortTrelloDataByDateAscending(b);for(var a=0;a<b.length;a++)this.processSingleTrelloActionRecord(a,b[a]);this.retrieveLabelNamesFromList();this.cleanupNullValues();return this.vizDataForJit},cleanupNullValues:function(){this.vizDataForJit.values.forEach(function(b){for(var a=0,d=b.values.length;a<d;a++)b.values[a]=b.values[a]||0},this)},sortTrelloDataByDateAscending:function(b){b.sort(function(a,b){var f=Date.parse(a.date),c=Date.parse(b.date);return f<c?-1:f>c?1:0})},actionArchiveCard:function(b){if(!h){if(b=
this.cardToListMap[b.data.card.id]){if(0>=this.counterPerList[b]){this.counterPerList[b]=1;for(var a=this.listOrder[b].listIdx,d=this.vizDataForJit.values.length-1;0<=d;d--)this.vizDataForJit.values[d].values[a]=(this.vizDataForJit.values[d].values[a]||0)+1}this.counterPerList[b]--;return!0}return!1}},actionCreateCard:function(b){var a=b.data.list.id;this.ensureListIsRegistered(b.data.list);this.counterPerList[a]++;this.cardToListMap[b.data.card.id]=a},ensureListIsRegistered:function(b){if(!this.listOrder[b.id]){this.counterPerList[b.id]=
0;var a=this.sizeOfObject(this.listOrder);this.listOrder[b.id]={name:b.name,id:b.id,listIdx:a,color:this.defaultColors[a%this.defaultColors.length]}}},actionMoveCard:function(b){var a=b.data.listBefore.id,d=b.data.listAfter.id;this.ensureListIsRegistered(b.data.listBefore);this.ensureListIsRegistered(b.data.listAfter);if(0>=this.counterPerList[a]){this.counterPerList[a]=1;for(var f=this.listOrder[a].listIdx,c=Math.max(0,this.vizDataForJit.values.length-1);c--;)this.vizDataForJit.values[c].values[f]=
(this.vizDataForJit.values[c].values[f]||0)+1}this.counterPerList[a]--;this.counterPerList[d]++;this.cardToListMap[b.data.card.id]=d},processSingleTrelloActionRecord:function(b,a){var d=a.date,f=!1,c={},e=function(){};c.addMemberToCard=e;c.removeMemberFromCard=e;c.addChecklistToCard=e;c.copyCard=e;c.updateCheckItemStateOnCard=e;c.updateBoard=e;c.commentCard=e;c.moveCardFromBoard=e;c.convertToCardFromCheckItem=e;c.addAttachmentToCard=e;c.removeChecklistFromCard=e;c.updateChecklist=e;c.createBoard=
e;c.addMemberToBoard=e;c.createList=function(){this.ensureListIsRegistered(a.data.list)};c.moveCardToBoard=function(){f=this.actionArchiveCard(a)};c.createCard=function(){f=!0;this.actionCreateCard(a)};c.updateCard=function(){!0==a.data.card.closed&&!1==a.data.old.closed&&(f=this.actionArchiveCard(a));a.data.listAfter&&a.data.listBefore&&(f=!0,this.actionMoveCard(a))};c[a.type]?c[a.type].call(this):console.error("missing action, not handled: "+a.type);f&&this.vizDataForJit.values.push({label:d,values:this.retrieveValueRowWithNaturalOrder()})},
retrieveValueRowWithNaturalOrder:function(){var b=[],a;for(a in this.listOrder)b[this.listOrder[a].listIdx]=this.counterPerList[a];return b},retrieveListsWithNaturalOrder:function(){var b=[],a;for(a in this.listOrder)b[this.listOrder[a].listIdx]=this.listOrder[a];return b},retrieveLabelNamesFromList:function(){for(var b in this.listOrder){var a=this.listOrder[b].listIdx;this.vizDataForJit.label[a]=this.listOrder[b].name;this.vizDataForJit.color[a]=this.defaultColors[a%this.defaultColors.length]}},
sizeOfObject:function(b){var a=0,d;for(d in b)b.hasOwnProperty(d)&&a++;return a}}};
