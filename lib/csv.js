module.exports = {
    COMMA: ',',
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
        ].join(this.COMMA);
        const over_under = issue.lead_time - issue.projected_lead_time;
        const over_under_ratio = issue.lead_time / issue.projected_lead_time;
        return `${prefix},${issue.times}${over_under},${over_under_ratio},\n`;
    }
};
