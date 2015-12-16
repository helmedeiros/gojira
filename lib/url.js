const auth_query = require('./auth_query');
const dates_query = require('./dates_query');

module.exports = {
    AND: '+and+',
    ISSUES_PATH: '/rest/api/2/search?',
    CONTROL_CHART_PATH: '/rest/greenhopper/1.0/rapid/charts/controlchart?',

    issues: function (base_url, project, component, work_group, max_results, user,
        password) {
        const jql = [`jql=project=${project}`, 'status=Done'];
        if (component) {
            jql.push(`component="${component}"`);
        }
        if (work_group) {
            jql.push(`"Work Group"="${work_group}"`);
        }
        jql.push('type=Story');
        const url = `${base_url}${this.ISSUES_PATH}${jql.join(this.AND)}&maxResults=${max_results || '300'}${auth_query.user_url(user, password)}`;
        console.log(`Issues url: ${url}\n`);
        return url;
    },
    control_chart: function (base_url, control_chart_url, user, password, from, to) {
        let rapidViewId = '';
        const swimLaneIds = [];
        const options = (control_chart_url.split('?')[1]).split('&');
        for (let x = 0; x < options.length; x++) {
            const option = options[x].split('=');
            if (option[0] === 'rapidView') {
                rapidViewId = option[1];
            }
            if (option[0] === 'swimlane') {
                swimLaneIds.push(option[1]);
            }
        }

        let url = base_url + this.CONTROL_CHART_PATH;

        url += ('rapidViewId=' + rapidViewId);
        for (let x = 0; x < swimLaneIds.length; x++) {
            url += ('&swimlaneId=' + swimLaneIds[x]);
        }
        url += dates_query.dates_url(from, to);
        url += auth_query.user_url(user, password);

        console.log('Control Chart url: ' + url + '\n');
        return url;
    }
};
