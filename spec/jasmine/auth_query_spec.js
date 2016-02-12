var auth_query = require('../../lib/auth_query');

describe('auth_query', function () {
    it('returns empty when user is missing', function () {
        expect(auth_query.user_url('', 'p')).toBe('');
        expect(auth_query.user_url(null, 'p')).toBe('');
    });

    it('builds username and password query', function () {
        expect(auth_query.user_url('a_user', 'a_password'))
            .toBe('&os_username=a_user&os_password=a_password');
    });
});
