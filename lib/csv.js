module.exports = {
    COMMA: ',',
    header: function() {
      return 'Type,Key,Summary,Status,Story Points,Projected Lead Time,Actual Lead Time,Backlog,In Progress,Validation,Sign Off,Done,Over/Under,Over/Under %\n';
    },
    from: function (issue) {
        var csv = issue.type + this.COMMA;
        csv += issue.key + this.COMMA;
        csv += issue.summary + this.COMMA;
        csv += issue.status + this.COMMA;
        csv += issue.points + this.COMMA;
        csv += issue.projected_lead_time + this.COMMA;
        csv += issue.lead_time + this.COMMA;
        csv += issue.backlog + this.COMMA;
        csv += issue.in_progress + this.COMMA;
        csv += issue.validation + this.COMMA;
        csv += issue.sign_off + this.COMMA;
        csv += issue.done + this.COMMA;
        csv += (issue.lead_time - issue.projected_lead_time) + this.COMMA;
        csv += ((issue.lead_time) / issue.projected_lead_time) + this.COMMA;
        csv += "\n";

        return csv;
    }

};
