
function ejsObjectFactory (config) {


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
        userMsg: config.username
    };

    return ejsObject;


}


module.exports = ejsObjectFactory;
