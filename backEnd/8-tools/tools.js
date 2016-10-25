/**
 * Created by xavierbarrufet on 23/4/16.
 */


var tools = function() {

    var _emailValidation=function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);

    }

    var _addDays=function(date,days) {
        var dateOk = new Date(date);
        return new Date().setDate(dateOk.getDate()+days);
    }

    return {
        emailValidation:_emailValidation,
        addDays:_addDays
    }
}()

module.exports = tools;