
function generateUserMsg(username) {

    var userMsg = '';

    if (username !== undefined) {
        userMsg = 'Welcome ' + username.toUpperCase();
    }

    return userMsg;
}


module.exports = generateUserMsg;