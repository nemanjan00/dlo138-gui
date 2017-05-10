var SerialPort = require('serialport');

var parser = require("./src/parser.js");

function countInstances(needle, heystack){
	var offset = 0;
	var count = 0;

	while((offset = heystack.indexOf(needle, offset + 1)) !== -1){
		count++;
	}

	return count;
}

SerialPort.list(function (err, ports) {
	ports.forEach(function(port) {
		console.log(port.comName);
		console.log(port.pnpId);
		console.log(port.manufacturer);
		console.log(" ");
	});

	console.log(ports[ports.length - 1].comName);
	var port = new SerialPort(ports[ports.length - 1].comName, { autoOpen: false , baudRate: 115200 });

	port.open(function (err) {
		if (err) {
			return console.log('Error opening port: ', err.message);
		}
	});

	// the open event will always be emitted
	port.on('open', function() {
		// open logic
	});

	var input = "";

	port.on('data', function (data) {
		var separator = "Net sampling time (us): ";

		input += data;

		if(input.indexOf(separator) !== -1){
			input = separator + input.split(separator)[1];

			if(countInstances("\r\n\r\n", input) == 2){
				console.log(parser.parse(input));

				input = "";
			}
		}
	});
});
