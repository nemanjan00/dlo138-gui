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

	headerParser: function(header, result){
		var parsers = {
			"Net sampling time (us): ": parser.samplingTimeParser,
			"Per Sample (us): ": parser.perSampleTimeParser
		}

		parser.textParser(header, result, parsers);
	},

	samplingTimeParser: function(line, result){
		result.samplingTime = line.replace("Net sampling time (us): ", "");
	},
	perSampleTimeParser: function(line, result){
		result.perSampleTime = line.replace("Per Sample (us): ", "");
	},

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


