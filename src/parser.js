var parser = {
	parse: function(string){
		string = string.trim();

		var parts = string.split("\r\n\r\n");

		var header = parts[0];
		var data = parts[1];

		var result = {};

		parser.headerParser(header, result);

		return result;
	},

	// Parse header

	headerParser: function(header, result){
		var parsers = {
			"Net sampling time (us): ": parser.samplingTimeParser,
			"Per Sample (us): ": parser.perSampleTimeParser,
			"Timebase: ": parser.timebaseParser,
			"Coupling: ": parser.couplingRangeParser,
			"Triggered: ": parser.triggeredParser
		}

		console.log(header);

		parser.textParser(header, result, parsers);
	},

	// Header line parsers

	samplingTimeParser: function(line, result){
		result.samplingTime = line.replace("Net sampling time (us): ", "") + " us";
	},
	perSampleTimeParser: function(line, result){
		result.perSampleTime = line.replace("Per Sample (us): ", "") + " us";
	},
	timebaseParser: function(line, result){
		result.timebase = line.replace("Timebase: ", "");
	},
	couplingRangeParser: function(line, result){
		line = line.split("Range: ");

		var chan = line[0].split(" ")[0];

		line[0] = line[0].split("Coupling: ")[1];

		if(result[chan] == undefined){
			result[chan] = {};
		}

		result[chan].range = line[1];
		result[chan].coupling = line[0];
	},
	triggeredParser: function(line, result){
		result.triggered = line.indexOf("YES") !== -1;
	},

	// Universal per line parser

	textParser: function(string, result, parsers){
		string = string.split("\r\n");

		string.forEach(function(line){
			Object.keys(parsers).forEach(function(parser){
				if(line.indexOf(parser) !== -1){
					parsers[parser](line, result);
				}
			});
		});
	}
}

module.exports = parser;


