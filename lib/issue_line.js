module.exports = {
    from: function (issue, config) {
        var points = issue.fields[config.story_points_field];
        return {
            type: issue.fields.issuetype.name,
            key: issue.key,
            summary: '"' + issue.fields.summary + '"',
            status: issue.fields.status.name,
            points: points,
            projected_lead_time: points * config.points_per_day,
            created_at: issue.fields.created || null,
            resolved_at: issue.fields.resolutiondate || null
        };
    }
};
