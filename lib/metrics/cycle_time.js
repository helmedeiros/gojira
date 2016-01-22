const DAY_MS = 60 * 60 * 24 * 1000;

module.exports = {
    compute: function (working_times, first_column_to_count) {
        if (!working_times || working_times.length === 0) {
            return 0;
        }
        const last_index = working_times.length - 1;
        let total_ms = 0;
        for (let i = first_column_to_count; i < last_index; i++) {
            total_ms += working_times[i];
        }
        return total_ms / DAY_MS;
    }
};
