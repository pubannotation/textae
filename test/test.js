test("util getUrlParameters default", function() {
	var defaultObject = {
		config: "",
		target: "",
		debug: false
	};

	// no parameter
	var result = textAeUtil.getUrlParameters();
	deepEqual(result, defaultObject, "get default if no parameter");

	// not string
	result = textAeUtil.getUrlParameters(1);
	deepEqual(result, defaultObject, "get default if number parameter");

	// only ?
	result = textAeUtil.getUrlParameters("?");
	deepEqual(result, defaultObject, "get default if only ? parameter");

	// without ?
	result = textAeUtil.getUrlParameters("debug");
	deepEqual(result, defaultObject, "get default if without ? parameter");
});

test("util getUrlParameters success", function() {
	var expectedObject = {
		config: "config.json",
		target:"annotations.json",
		debug:true
	};
	var result = textAeUtil.getUrlParameters('?config=config.json&target=annotations.json&debug');
	deepEqual(result, expectedObject, "get url parmeter by object");
})