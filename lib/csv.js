const over_under = require('./over_under');

const COMMA = ',';

module.exports = {
    header: function (columns) {
        return `Type,Key,Summary,Status,Story Points,Projected Lead Time,Actual Lead Time,${columns},Over/Under,Over/Under %\n`;
    },
    from: function (issue) {
        const prefix = [
            issue.type,
            issue.key,
            issue.summary,
            issue.status,
            issue.points,
            issue.projected_lead_time,
            issue.lead_time
        ].join(COMMA);
        const diff = over_under.diff(issue.lead_time, issue.projected_lead_time);
        const ratio = over_under.ratio(issue.lead_time, issue.projected_lead_time);
        return `${prefix},${issue.times}${diff},${ratio},\n`;
    }
};
