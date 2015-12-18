const querystring = require('querystring');
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
        const parsed = querystring.parse(control_chart_url.split('?')[1]);
        const rapidViewId = parsed.rapidView || '';
        const swimLaneIds = parsed.swimlane ? [].concat(parsed.swimlane) : [];

        const swimlane_params = swimLaneIds.map(id => `&swimlaneId=${id}`).join('');
        const url = `${base_url}${this.CONTROL_CHART_PATH}rapidViewId=${rapidViewId}${swimlane_params}${dates_query.dates_url(from, to)}${auth_query.user_url(user, password)}`;

        console.log(`Control Chart url: ${url}\n`);
        return url;
    }
};
