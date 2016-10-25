/**
 * Created by xavierbarrufet on 2/5/16.


var eventQueue=require("../5-Infrastructure/eventQueue")
var CTE=require("../4-helpers/eventQueue")
var Q = require('Q');
var specialTaskService=require("../2-service/specialTaskFlowService")

function specialTaskEventListener(event) {

    if(event.type==CTE.EVT_COMMENT_APPROVED) {
        //move special task to approved
        var data=event.body;
        specialTaskService.updateStatusSpecialTask(data.specialTaskId,CTE.TASK_READY)
            .fail(function(err) {
                
        })
    }

}


function addSpecialTaskEventListener() {
    eventQueue.addListener(CTE.EVT_COMMENT_APPROVED,specialTaskEventListner)
}

var eventRoutes=function() {
  var _addListeners = function() {
      addSpecialTaskEventListener();
  }
    return {
        addListeners:_addListeners
    }
}();

module.exports=eventRoutes
 */