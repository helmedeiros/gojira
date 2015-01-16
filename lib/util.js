var fs = require("fs");

module.exports = {
    save_to_file: function (file_name, content) {
        fs.writeFile(file_name, content, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(content);
                console.log("The file was saved! " + file_name);
            }
        });
    }
};
