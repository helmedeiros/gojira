const querystring = require('querystring');
const auth_query = require('./auth_query');
const dates_query = require('./dates_query');

module.exports = {
    AND: '+and+',
    ISSUES_PATH: '/rest/api/2/search?',
    CONTROL_CHART_PATH: '/rest/greenhopper/1.0/rapid/charts/controlchart?',

    issues: function (base_url, project, component, work_group, max_results, user,
        password, status_filter, start_at, issue_types) {
        const jql = [`jql=project=${project}`, status_filter || 'status=Done'];
        if (component) {
            jql.push(`component="${component}"`);
        }
        if (work_group) {
            jql.push(`"Work Group"="${work_group}"`);
        }
        const types = issue_types === undefined || issue_types === null ? ['Story'] : issue_types;
        if (types.length === 1) {
            jql.push('type=' + types[0]);
        } else if (types.length > 1) {
            jql.push('type in (' + types.join(',') + ')');
        }
        const paging = '&maxResults=' + (max_results || '300') + '&startAt=' + (start_at || 0);
        return `${base_url}${this.ISSUES_PATH}${jql.join(this.AND)}${paging}${auth_query.user_url(user, password)}`;
    },
    control_chart: function (base_url, control_chart_url, user, password, from, to) {
        const parsed = querystring.parse(control_chart_url.split('?')[1]);
        const rapidViewId = parsed.rapidView || '';
        const swimLaneIds = parsed.swimlane ? [].concat(parsed.swimlane) : [];

        const swimlane_params = swimLaneIds.map(id => `&swimlaneId=${id}`).join('');
        return `${base_url}${this.CONTROL_CHART_PATH}rapidViewId=${rapidViewId}${swimlane_params}${dates_query.dates_url(from, to)}${auth_query.user_url(user, password)}`;
    }
};
