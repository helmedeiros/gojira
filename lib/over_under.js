module.exports = {
    diff: function (actual, projected) {
        return actual - projected;
    },
    ratio: function (actual, projected) {
        if (!projected) {
            return 0;
        }
        return actual / projected;
    }
};
