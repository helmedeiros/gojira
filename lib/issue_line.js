module.exports = {
    from: function (issue, points_per_day) {
        const points = issue.fields.customfield_10003;
        return {
            type: issue.fields.issuetype.name,
            key: issue.key,
            summary: `"${issue.fields.summary}"`,
            status: issue.fields.status.name,
            points: points,
            projected_lead_time: points * points_per_day
        };
    }
};
