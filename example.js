var parser = require("./src/parser");

fs = require('fs')
fs.readFile('./example.txt', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}

	console.log(JSON.stringify(parser.parse(data), null, 4));
});

