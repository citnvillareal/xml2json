/*!
 * xml2json library
 * Original author: Neil K. Villareal
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Neil K. Villareal
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 */

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
					obj["value"]["@"+keyValue[0]] = keyValue[1].replace(/(^")|("$)/g,"");
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

				if(typeof unendedTag != undefined) {
					if(unendedTag['value'] == "") {
						unendedTag['value'] = {};
					}

					if(typeof unendedTag['value'][endedTag['key']] != undefined) {

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

		obj = obj || this.toJSON();

		if(typeof obj != 'object') return false;

		for(var k in obj) {
			if(k == key) {
				result.push(obj[key]);
			} else if(k == ("@"+key)) {
				result.push(obj["@"+key]);
			} else {
				if(typeof obj[k] == 'object') {
					var tempObj = this.get(key, obj[k]);
					if(typeof tempObj == "string") {
						result.push(tempObj);
					} else {
						for(var i in tempObj) {
							result.push(tempObj[i]);
						}
					}
				}
			}
		}

		return result.length <= 1? (result[0] || false): result;
	};
	
	Plugin.prototype.makeArray = function(obj) {
		var temp = [];
		
		if(Array.isArray(obj)) return obj;
		
		temp.push(obj);
		
		return temp;
	};

	return Plugin;

})(window, document, 'undefined');

if(typeof define == 'function' && typeof require == 'function') define([], function(){return xml2json;});