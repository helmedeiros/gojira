var auth_query = require('./auth_query');

module.exports = {
    AND: '+and+',
    ISSUES_PATH: '/rest/api/2/search?',
    CONTROL_CHART_PATH: '/rest/greenhopper/1.0/rapid/charts/controlchart?',
    dates_url: function(from, to) {
        var url = '';
        if (from) {
            url += '&from=';
            url += from;
        }
        if (to) {
            url += '&to=';
            url += to;
        }
        return url;
    },

    issues: function(base_url, project, component, work_group, max_results, user,
        password) {
        var url = base_url + this.ISSUES_PATH;
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
        url += auth_query.user_url(user, password);
        console.log('Issues url: ' + url + '\n');
        return url;
    },
    control_chart: function(base_url, control_chart_url, user, password, from, to) {
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

        var url = base_url + this.CONTROL_CHART_PATH;

        url += ('rapidViewId=' + rapidViewId);
        for (x = 0; x < swimLaneIds.length; x++) {
            url += ('&swimlaneId=' + swimLaneIds[x]);
        }
        url += this.dates_url(from, to);
        url += auth_query.user_url(user, password);

        console.log('Control Chart url: ' + url + '\n');
        return url;
    }
};
