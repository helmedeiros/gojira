var auth_query = require('./auth_query');

var ISSUE_PATH = '/rest/api/2/issue/';

module.exports = {
    build: function (base_url, issue_key, user, password) {
        return base_url + ISSUE_PATH + encodeURIComponent(issue_key) + '?expand=changelog' + auth_query.user_url(user, password);
    }
};
