var SerialPort = require('serialport');
var parser = require("./parser");
var events = require('events');


function countInstances(needle, heystack){
	var offset = 0;
	var count = 0;

	while((offset = heystack.indexOf(needle, offset + 1)) !== -1){
		count++;
	}

	return count;
}

module.exports = function(port){
	var eventEmitter = new events.EventEmitter();

	var port = new SerialPort(port, { autoOpen: false , baudRate: 115200 });

	port.open(function (err) {
		if (err) {
			eventEmitter.emit("error", err.message);

			console.log('Error opening port: ', err.message);
		}
	});

	port.on('open', function() {
		eventEmitter.emit("open");
	});

	var input = "";

	port.on('data', function (data) {
		var separator = "Net sampling time (us): ";

		input += data;

		if(input.indexOf(separator) !== -1){
			input = separator + input.split(separator)[1];

			if(countInstances("\r\n\r\n", input) == 2){
				eventEmitter.emit("capture", parser.parse(input));

				input = "";
			}
		}
	});

	return eventEmitter;
}

module.exports.listPorts = function(){
	return new Promise(function(resolve, reject){
		SerialPort.list(function (err, ports) {
			resolve(ports);
		});
	});
}

