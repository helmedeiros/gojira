module.exports = {
    user_url: function (user, password) {
        if (!user) {
            return '';
        }
        return '&os_username=' + user + '&os_password=' + password;
    }
};
