function generateEjsVariables (title, body, msg, userMsg, error, navMenu, isLoggedIn, userStatusData, userEditData, lightsData, gardensData) {
    

    var ejsObject = {
        title: title,
        body: body,
        msg: msg,
        userMsg: userMsg,
        error: error,
        navMenu: navMenu,
        isLoggedIn: isLoggedIn,
        userStatusData: userStatusData,
        userEditData: userEditData,
        lightsData: lightsData,
        gardensData: gardensData,
        currentPage: "color:white"
    };

    return ejsObject;


}


module.exports = generateEjsVariables;