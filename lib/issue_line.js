module.exports = {
    from: function (issue, config) {
        var points = issue.fields[config.story_points_field];
        var line = {
            type: issue.fields.issuetype.name,
            key: issue.key,
            summary: '"' + issue.fields.summary + '"',
            status: issue.fields.status.name,
            points: points,
            projected_lead_time: points * config.points_per_day,
            created_at: issue.fields.created || null,
            resolved_at: issue.fields.resolutiondate || null
        };
        if (Array.isArray(issue.transitions)) {
            line.transitions = issue.transitions;
        }
        return line;
    }
};
