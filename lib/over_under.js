module.exports = {
    diff: function (actual, projected) {
        return actual - projected;
    },
    ratio: function (actual, projected) {
        return actual / projected;
    }
};
