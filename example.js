var parser = require("./src/parser");

fs = require('fs')
fs.readFile('./example.txt', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}

	console.log(parser.parse(data));
});

