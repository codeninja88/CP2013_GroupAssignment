
var defaults = {

    msg: "",
    error:"",
    userStatusData: [],
    userEditData: [],
    lightsData: [],
    gardensData: [],
    prefStatusData: [],

    userMsg: function(req) {

        var userMsg = "";

        if (req.session.username) userMsg = 'Welcome ' + req.session.username.toUpperCase();

        return userMsg;
    }

};

module.exports = defaults;


