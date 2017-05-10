var parser = {
	parse: function(string){
		string = string.trim();

		var parts = string.split("\r\n\r\n");

		var header = parts[0];
		var data = parts[1];

		var result = {};

		parser.headerParser(header, result);
		parser.dataParser(data, result);

		return result;
	},

	// Parse header

	headerParser: function(header, result){
		var parsers = {
			"Net sampling time (us): ": parser.samplingTimeParser,
			"Per Sample (us): ": parser.perSampleTimeParser,
			"Timebase: ": parser.timebaseParser,
			"Coupling: ": parser.couplingRangeParser,
			"Triggered: ": parser.triggeredParser,
			" Stats ": parser.chanUnitParser,
			"Vmax": parser.statsLineParser,
			"Freq": parser.statsLineParser
		}

		parser.textParser(header, result, parsers);

		result.currentChan = undefined;
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
	chanUnitParser: function(line, result){
		result.currentChan = line.split(" ")[0];
		result[result.currentChan].unit = line.split("(")[1].split(")")[0];
	},
	statsLineParser: function(line, result){
		line = line.trim();

		if(result[result.currentChan].stats == undefined){
			result[result.currentChan].stats = {};
		}

		parser.variableParser(line, result[result.currentChan].stats);
	},

	// Parsing data
	
	dataParser: function(data, result){
		data = data.split("\r\n");

		tableHeader = data[0].split("\t");

		delete data[0];

		result.samples = [];

		data.forEach(function(line){
			line = line.split("\t");

			var sample = {};

			line.forEach(function(value, key){
				sample[tableHeader[key]] = value;
			});

			result.samples.push(sample);
		});
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
	},

	variableParser: function(string, result){
		string = string.split(", ");

		string.forEach(function(variable){
			variable = variable.split(": ");

			result[variable[0]] = variable[1];
		});
	}
}

module.exports = parser;


