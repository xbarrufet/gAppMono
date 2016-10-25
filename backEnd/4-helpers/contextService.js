/**
 * Created by xavierbarrufet on 9/5/16.
 */

var CTE=require("../4-helpers/constants");

var contextService=function() {

    var contextDev={};

    var _getContext=function (context) {
        if(context==CTE.CONTEXT_DEV) {
            return contextDev;
        } else {


        }
    }

    var _setContextDev=function (gardenCenterId,gardenId) {
       contextDev.gardenCenterId=gardenCenterId;
        contextDev.gardenId=gardenId;

    }
    
    return {
        
        getContext:_getContext,
        setContextDev:_setContextDev
        
    }
}()

module.exports = contextService;
