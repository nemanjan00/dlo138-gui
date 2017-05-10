var serial = require("../src/serial");

serial.listPorts().then(function(ports){
	var port = ports[ports.length - 1].comName;

	serial(port).on("capture", function(data){
		console.log(data);
	});
});

