# xml2json
This will enable you to parse your xml string to JSON Object.



##### To Get Started
1. import the [xml2json](https://github.com/citnvillareal/xml2json/blob/master/xml2json.js) library.



##### Browser Support
1. Internet Explorer 8, 9, 10, ...
2. Chrome 
3. Firefox



##### First Usage 
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });
	var jsonResult = xml2jsonParser.toJSON();
	var employees = xml2jsonParser.get('employee');


##### Second Usage

	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json();
	var jsonResult = xml2jsonParser.toJSON(xmlString);
	var employees = xml2jsonParser.get('employee', jsonResult);



##### Example 01
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });
	console.log(xml2jsonParser.toJSON());

##### Example 01: Console Output
	Object {
	    "employees": Object {
	        "employee": Array[2] {
	        	0: Object {
	            	"empId": "1000"
	        	}, 
	        	1: Object {
	            	"empId": "2000"
	        	}
	        }
	    }
	}



##### Example 02
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });
	console.log(xml2jsonParser.get('employee'));

##### Example 02: Console Output
	Array[2] {
    	0: Object {
        	"empId": "1000"
    	}, 
    	1: Object {
        	"empId": "2000"
    	}
    }



##### Example 03
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });
	console.log(xml2jsonParser.get('employees'));

##### Example 03: Console Output
	Object {
        "employee": Array[2] {
        	0: Object {
            	"empId": "1000"
        	}, 
        	1: Object {
            	"empId": "2000"
        	}
        }
    }



##### Example 04
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json();
	var jsonResult = xml2jsonParser.toJSON(xmlString);
	console.log(jsonResult);

##### Example 04: Console Output
	Object {
	    "employees": Object {
	        "employee": Array[2] {
	        	0: Object {
	            	"empId": "1000"
	        	}, 
	        	1: Object {
	            	"empId": "2000"
	        	}
	        }
	    }
	}



##### Example 05
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });
	var jsonResult = xml2jsonParser.toJSON(xmlString);
	console.log(xml2jsonParser.get('employee', jsonResult));

##### Example 05: Console Output
	Array[2] {
    	0: Object {
        	"empId": "1000"
    	}, 
    	1: Object {
        	"empId": "2000"
    	}
    }



##### Example 06
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });
	var jsonResult = xml2jsonParser.toJSON(xmlString);
	console.log(xml2jsonParser.get('employees', jsonResult));

##### Example 06: Console Output
	Object {
        "employee": Array[2] {
        	0: Object {
            	"empId": "1000"
        	}, 
        	1: Object {
            	"empId": "2000"
        	}
        }
    }