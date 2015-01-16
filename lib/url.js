module.exports = {
    AND: '+and+',
    BASE_URL: 'https://jira.example.com/rest/api/2/search?',

    build_for: function (project, component, work_group, max_results) {
        var url = this.BASE_URL;
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
        url += '&os_username=tv_pas&os_password=tvuser';
        console.log('Issues url: ' + url + '\n');
        return url;
    }
};
