var cli = require('./lib/cli');
var main = require('./lib/main');

main.run(cli.parse(process.argv)).catch(function (error) {
    console.log(error);
});
