// Run test with jQuery.
global.window = require("jsdom")
	.jsdom()
	.createWindow();
global.$ = require("jquery");
var getUrlParameters = require('../../src/lib/util/getUrlParameters');

describe("util getUrlParameters default", function() {
	var emptyObject = {};

	// no parameter
	it('get empty object if no parameter', function() {
		var result = getUrlParameters();
		expect(result).toEqual(emptyObject);
	});

	// only ?
	it('get empty object if only ? parameter', function() {
		var result = getUrlParameters("?");
		expect(result).toEqual(emptyObject);
	});
});

describe("util getUrlParameters success", function() {
	it('get url parmeter by object', function() {
		var result = getUrlParameters('?config=config.json&target=annotations.json&debug');
		expect(result).toEqual({
			config: "config.json",
			target: "annotations.json",
			debug: true
		});
	});

	// without ?
	it('get parameter if without ?', function() {
		var result = getUrlParameters("debug");
		expect(result).toEqual({
			debug: true
		});
	});

	// not string
	it('get parameter if number parameter', function() {
		var result = getUrlParameters(1);
		expect(result).toEqual({
			"1": true
		});
	});
})