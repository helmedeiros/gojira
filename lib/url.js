var _ = require("underscore");

module.exports = {
    AND: '+and+',
    ISSUES_BASE_URL: 'https://jira.example.com/rest/api/2/search?',
    CONTROL_CHART_BASE_URL: 'https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?',
    user_url: function (user, password) {
        var url = '';
        if (user) {
            url += '&os_username=';
            url += user;
            url += '&os_password=';
            url += password
        }
        return url;
    },
    dates_url: function (from, to) {
        var url = '';
        if (from) {
            url += '&from='
            url += from;
        }
        if (to) {
            url += '&to=';
            url += to;
        }
        return url;
    },

    issues: function (project, component, work_group, max_results, user, password) {
        var url = this.ISSUES_BASE_URL;
        url += 'jql=project=';
        url += project;
        url += this.AND;
        url += 'status=Done';
        url += this.AND;
        if (component) {
            url += 'component="';
            url += component;
            url += '"';
            url += this.AND;
        }
        if (work_group) {
            url += '"Work Group"="';
            url += work_group;
            url += '"';
            url += this.AND;
        }
        url += 'type=Story';
        url += '&maxResults=';
        url += max_results ? max_results : '300';
        url += this.user_url(user, password);
        console.log('Issues url: ' + url + '\n');
        return url;
    },
    control_chart: function (control_chart_url, user, password, from, to) {
        var rapidViewId = '';
        var swimLaneIds = [];
        var options = (control_chart_url.split('?')[1]).split('&');
        for (var x = 0; x < options.length; x++) {
            var option = options[x].split('=');
            if (option[0] === 'rapidView') {
                rapidViewId = option[1];
            }
            if (option[0] === 'swimlane') {
                swimLaneIds.push(option[1]);
            }
        }

        var url = this.CONTROL_CHART_BASE_URL;

        url += ('rapidViewId=' + rapidViewId);
        for (x = 0; x < swimLaneIds.length; x++) {
            url += ('&swimlaneId=' + swimLaneIds[x]);
        }
        url += this.dates_url(from, to);
        url += this.user_url(user, password);

        console.log('Control Chart url: ' + url + '\n');
        return url;
    }
};
