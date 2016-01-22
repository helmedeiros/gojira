const fs = require('fs');

module.exports = {
    save_to_file: function (file_name, content) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(file_name, content, function (err) {
                if (err) {
                    return reject(err);
                }
                console.log(`The file was saved! ${file_name}`);
                resolve();
            });
        });
    }
};
