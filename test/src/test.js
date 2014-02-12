test("util getUrlParameters default", function() {
	var defaultObject = {};

	// no parameter
	var result = textAeUtil.getUrlParameters();
	deepEqual(result, defaultObject, "get default if no parameter");

	// only ?
	result = textAeUtil.getUrlParameters("?");
	deepEqual(result, defaultObject, "get default if only ? parameter");
});

test("util getUrlParameters success", function() {
	var result = textAeUtil.getUrlParameters('?config=config.json&target=annotations.json&debug');
	deepEqual(result, {
		config: "config.json",
		target: "annotations.json",
		debug: true
	}, "get url parmeter by object");

	// without ?
	result = textAeUtil.getUrlParameters("debug");
	deepEqual(result, {
		debug: true
	}, "get parameter if without ?");

	// not string
	result = textAeUtil.getUrlParameters(1);
	deepEqual(result, {
		"1": true
	}, "get parameter if number parameter");
})