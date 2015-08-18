var xml2json = (function(window, document, undefined){

	var options = {
		xml: false
	};

	function Plugin(opts) {
		this.init(opts);
	}

	Plugin.prototype.init = function(opts) {
		for(var key in opts) {
			options[key] = opts[key];
		}
		this.options = options;
	};

	Plugin.prototype.getAllTags = function(xmlString) {
		var tags = [];
		var xmlStringLen = xmlString.length;

		var start = false;
		var end = false;
		var tag = "";
		var content = "";
		for(var i = 0; i < xmlStringLen; i++) {

			if(xmlString[i] == "<") {
				start = true;
				if(content.replace(/\s/g,'').length > 0) {
					tags.push(content);
				}	
				content = "";
			}
			if(xmlString[i] == ">") {
				end = true;
			}

			if(start && !end) {
				tag+=xmlString[i];
			}

			if(!start && !end) {
				content += xmlString[i];
			}

			if(start && end) {
				tag+=xmlString[i];
				tags.push(tag);
				start = false;
				end = false;
				tag = "";
			}
		}

		return tags;
	};

	Plugin.prototype.generateObject = function(xmlString) {
		var obj = {};
		var pattern = /<[^\/]([^>]+)\/?>/g;

		if(pattern.test(xmlString)) {
			xmlString = xmlString.replace(/(^<)|(>$)/g, "");
			var tempArr = xmlString.split(/\s/g);
			
			obj["key"] = tempArr[0];
			if(tempArr.length > 1) {

				obj["value"] = {};
				for(var i = 1; i < tempArr.length; i++) {
					var keyValue = tempArr[i].split("=");
					obj["value"][keyValue[0]] = keyValue[1].replace(/(^")|("$)/g,"");
				}
			} else {
				obj["value"] = "";
			}
		} else {
			return false;
		}

		return obj;
	};

	Plugin.prototype.convertTagsToObj = function(tags) {
		for(var i in tags) {
			var obj = this.generateObject(tags[i]);
			if(obj) {
				tags[i] = obj;
			}
		}

		return tags;
	};

	Plugin.prototype.toJSON = function(xmlString) {

		var xmlString = xmlString || this.options.xml,
			tags = this.getAllTags(xmlString),
			unendedTags = [],
			endedTag,
			json = {};

		tags = this.convertTagsToObj(tags);		



		for(var i in tags) {
			var tag = tags[i];

			if(typeof tag == "object") {
				
				if(!(/\/$/g.test(tag['key']))) {
					unendedTags.push(tag);
				} else {
					var unendedTag = unendedTags.pop();
					unendedTag["value"][unendedTag["key"].replace(/\/$/g, "")] = tag["value"];
					unendedTags.push(unendedTag);
				}

			} else if(typeof tag == "string" && !(/^<\/[^>]+>$/g.test(tag))) {
				var unendedTag = unendedTags.pop();
				if(typeof unendedTag["value"] == 'object') {
					unendedTag["value"]["value"] = tag;
				} else {
					unendedTag["value"] = tag;
				}
				unendedTags.push(unendedTag);
			} else if(typeof tag == "string" && /^<\/[^>]+>$/g.test(tag)) {
				endedTag = unendedTags.pop();
				var unendedTag = unendedTags.pop();

				if(typeof unendedTag != 'undefined') {
					if(unendedTag['value'] == "") {
						unendedTag['value'] = {};
					}

					if(typeof unendedTag['value'][endedTag['key']] != 'undefined') {

						if(Array.isArray(unendedTag['value'][endedTag['key']])) {
							unendedTag['value'][endedTag['key']].push(endedTag['value']);
						} else {
							var temp = [];
							temp.push(unendedTag['value'][endedTag['key']]);
							temp.push(endedTag['value']);
							unendedTag['value'][endedTag['key']] = temp;
						}
						
					} else {
						unendedTag['value'][endedTag['key']] = endedTag['value'];
					}

					unendedTags.push(unendedTag);
				} else {
					json[endedTag['key']] = endedTag['value'];
				}
			}
		}

		return json;
	};

	Plugin.prototype.get = function(key, obj) {
		var result = [];

		if(this.options.xml == false) return false;

		if(typeof obj == 'undefined') obj = this.toJSON();

		if(obj.hasOwnProperty(key)) {
			result.push(obj[key]);
		}

		for(var k in obj) {
			if(typeof obj[k] == 'object') {
				var tempObj = this.get(key, obj[k]);
				for(var i in tempObj) {
					result.push(tempObj[i]);
				}
			}
		}

		return result;
	};

	return Plugin;

})(window, document, 'undefined');