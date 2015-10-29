function ejsObjectFactory (config) {

    function generateUserMsg() {

        var userMsg = '';

        if (config.username !== undefined) {
            userMsg = 'Welcome ' + config.username.toUpperCase();
        }

        return userMsg;
    }


    var ejsObject = {
        title: config.title || '',
        heading: config.heading || '',
        msg: config.msg || '',
        error: config.error || '',
        navMenu: config.navMenu || '',
        isLoggedIn: config.isLoggedIn,
        userStatusData: config.userStatusData || '',
        userEditData: config.userEditData || '',
        lightsData: config.lightsData || '',
        gardensData: config.gardensData || '',
        prefStatusData: config.prefStatusData || '',
        currentPage: "color:white",
        userMsg: generateUserMsg()
    };

    return ejsObject;


}


module.exports = ejsObjectFactory;
