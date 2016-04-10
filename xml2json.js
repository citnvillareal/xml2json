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

var xml2json = (function(window, document, undefined) {

	var options = {
		xml : false
	};

	function Plugin(opts) {
		this.init(opts);
	}

	Plugin.prototype.init = function(opts) {
		for ( var key in opts) {
			options[key] = opts[key];
		}
		this.options = options;
	};

	Plugin.prototype.getAllTags = function(xmlString) {
		var tags = [], stackTest = [];
		var tag = "";

		var xmlStringLen = xmlString.length;
		var isTag = false;

		for (var i = 0; i < xmlStringLen; i++) {

			if (xmlString[i] == "<") {
				if (isTag === false && tag.replace(/\s/g, '').length > 0) {
					tags.push(tag);
					tag = "";
				}
				stackTest.push("<");
				isTag = true;
				tag = tag.replace(/(^\s*)|(\s*$)/g, "");
			}

			if (xmlString[i] == ">") {
				stackTest.pop();
				isTag = true;
			}

			tag += xmlString[i];

			if (stackTest.length == 0 && isTag === true) {
				tags.push(tag);
				tag = "";
				isTag = false;
			}

		}

		return tags;
	};

	Plugin.prototype.generateObject = function(xmlString) {
		var obj = {}, pattern = /<[^\/]([^>]+)\/?>/g, splitPattern = /([^\s"']+"[^"]*"|'[^']*'|\[[^\]]*\])|("[^"]*"|'[^']*')|([^\s"'\]]+)/g, tempArr = [];

		if (pattern.test(xmlString)) {
			xmlString = xmlString.replace(/(^<)|(>$)/g, "");

			var found = null;
			while (found = splitPattern.exec(xmlString)) {
				tempArr.push(found[0]);
			}

			obj["key"] = tempArr[0];
			obj["value"] = "";

			if (tempArr.length > 1) {
				obj["value"] = {};

				for (var i = 1; i < tempArr.length; i++) {
					var keyValue = tempArr[i].split("=");
					if (keyValue.length > 1) {
						obj["value"]["@" + keyValue[0]] = keyValue[1].replace(
								/(^")|("$)/g, "");
					} else {
						obj["value"]["@" + keyValue[0]] = "";
					}
				}
			}
		} else {
			return false;
		}
		return obj;
	};

	Plugin.prototype.convertTagsToObj = function(tags) {

		for ( var i in tags) {
			var obj = this.generateObject(tags[i]);
			if (obj) {
				tags[i] = obj;
			}
		}

		return tags;
	};

	Plugin.prototype.toJSON = function(xmlString) {

		var tags = [], unendedTags = [];

		xmlString = "<xml2json>" + (xmlString || this.options.xml)
				+ "</xml2json>";

		tags = this.convertTagsToObj(this.getAllTags(xmlString));

		for ( var i in tags) {

			var tag = tags[i];

			if (typeof tag == "object") {

				unendedTags.push(tag);

			}

			if (typeof tag == "string" && !(/^<\/[^>]+>$/g.test(tag))) {

				var unendedTag = unendedTags.pop();
				unendedTag["value"] = tag;
				unendedTags.push(unendedTag);

			}

			if (typeof tag == "string" && /^<\/[^>]+>$/g.test(tag)) {

				do {

					var endedTag = unendedTags.pop(), unendedTag = unendedTags
							.pop(), validateEndTag = endedTag['key'] == tag
							.replace(/^<\/|>$/g, '');

					if (typeof unendedTag == undefined) {
						return endedTag['value'];
					}

					if (unendedTag['value'] == "") {
						unendedTag['value'] = {};
					}

					if (typeof unendedTag['value'][endedTag['key']] != undefined
							&& validateEndTag) {

						if (unendedTag['value'][endedTag['key']] instanceof Array) {
							unendedTag['value'][endedTag['key']]
									.push(endedTag['value']);
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

				} while (!validateEndTag && typeof unendedTag != undefined);

			}
		}

		return false;
	};

	Plugin.prototype.get = function(key, obj) {
		var result = [];

		if (this.options.xml == false)
			return false;

		obj = obj || this.toJSON();

		if (typeof obj != 'object')
			return false;

		for ( var k in obj) {
			if (k == key) {
				result.push(obj[key]);
			} else if (k == ("@" + key)) {
				result.push(obj["@" + key]);
			} else {
				if (typeof obj[k] == 'object') {
					var tempObj = this.get(key, obj[k]);
					if (typeof tempObj == "string") {
						result.push(tempObj);
					} else if (typeof tempObj == "object") {
						result.push(tempObj);
					} else if (Array.isArray(tempObj)) {
						for ( var i in tempObj) {
							result.push(tempObj[i]);
						}
					}
				}
			}
		}

		return result.length <= 1 ? (result[0] || false) : result;
	};

	Plugin.prototype.makeArray = function(obj) {
		var temp = [];

		if (Array.isArray(obj))
			return obj;

		if (obj !== false) {
			temp.push(obj);
		}

		return temp;
	};

	return Plugin;

})(window, document, 'undefined');

if (typeof define == 'function' && typeof require == 'function') {
	define([], function() {
		return xml2json;
	});
}