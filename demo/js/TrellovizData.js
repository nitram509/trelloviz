var TrellovizData=function(){};
TrellovizData.prototype={listOrderIds:[],listOrderNames:[],counterPerList:{},cardToListMap:{},vizDataForJit:{label:[],values:[]},init:function(){this.listOrderIds=[];this.listOrderNames=[];this.counterPerList={};this.cardToListMap={};this.vizDataForJit={label:[],values:[]}},computeVizData_all_lists:function(a){this.init();this.sortTrelloDataByDateAscending(a);for(var b=0;b<a.length;b++)this.processSingleTrelloActionRecord(b,a[b]);this.retrieveLabelNamesFromList();this.cleanupNullValues();return this.vizDataForJit},
cleanupNullValues:function(){this.vizDataForJit.values.forEach(function(a){for(var b=0,e=a.values.length;b<e;b++)a.values[b]=a.values[b]||0},this)},sortTrelloDataByDateAscending:function(a){a.sort(function(a,e){var f=Date.parse(a.date),c=Date.parse(e.date);return f<c?-1:f>c?1:0})},actionArchiveCard:function(a){if(a=this.cardToListMap[a.data.card.id]){if(0>=this.counterPerList[a]){this.counterPerList[a]=1;for(var b=this.listOrderIds.indexOf(a),e=this.vizDataForJit.values.length-1;0<=e;e--)this.vizDataForJit.values[e].values[b]=
(this.vizDataForJit.values[e].values[b]||0)+1}this.counterPerList[a]--;return!0}return!1},actionCreateCard:function(a){var b=a.data.list.id;this.ensureListIsRegistered(a.data.list);this.counterPerList[b]++;this.cardToListMap[a.data.card.id]=b},ensureListIsRegistered:function(a){this.counterPerList[a.id]||(this.counterPerList[a.id]=0,this.listOrderIds.push(a.id),this.listOrderNames.push(a.name))},actionMoveCard:function(a){var b=a.data.listBefore.id,e=a.data.listAfter.id;this.ensureListIsRegistered(a.data.listBefore);
this.ensureListIsRegistered(a.data.listAfter);if(0>=this.counterPerList[b]){this.counterPerList[b]=1;for(var f=this.listOrderIds.indexOf(b),c=this.vizDataForJit.values.length-1;0<=c;c--)this.vizDataForJit.values[c].values[f]=(this.vizDataForJit.values[c].values[f]||0)+1}this.counterPerList[b]--;this.counterPerList[e]++;this.cardToListMap[a.data.card.id]=e},processSingleTrelloActionRecord:function(a,b){var e=b.date,f=!1,c={},d=function(){};c.addMemberToCard=d;c.removeMemberFromCard=d;c.addChecklistToCard=
d;c.copyCard=d;c.updateCheckItemStateOnCard=d;c.updateBoard=d;c.commentCard=d;c.moveCardFromBoard=d;c.convertToCardFromCheckItem=d;c.addAttachmentToCard=d;c.removeChecklistFromCard=d;c.updateChecklist=d;c.createList=function(){this.ensureListIsRegistered(b.data.list)};c.moveCardToBoard=function(){f=this.actionArchiveCard(b)};c.createCard=function(){f=!0;this.actionCreateCard(b)};c.updateCard=function(){!0==b.data.card.closed&&!1==b.data.old.closed&&(f=this.actionArchiveCard(b));b.data.listAfter&&
b.data.listBefore&&(f=!0,this.actionMoveCard(b))};c[b.type]?c[b.type].call(this):console.error(b.type);if(f){c=[];for(d=0;d<this.listOrderIds.length;d++)c.push(this.counterPerList[this.listOrderIds[d]]);this.vizDataForJit.values.push({label:e,values:c})}},retrieveLabelNamesFromList:function(){for(var a=0;a<this.listOrderNames.length;a++)this.vizDataForJit.label.push(this.listOrderNames[a])}};
