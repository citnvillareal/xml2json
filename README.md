# xml2json
This will enable you to parse your xml string to JSON Object.



##### To Get Started
1. import the [xml2json](https://github.com/citnvillareal/xml2json/blob/master/xml2json.js) library.



##### Usage 
	var xmlString = "<employees>
						<employee>
							<empId>1000</empId>
						</employee>
						<employee>
							<empId>2000</empId>
						</employee>
					</employees>";

	var xml2jsonParser = new xml2json({ xml: xmlString });