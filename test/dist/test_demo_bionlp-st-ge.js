// test for demo. run after grunt dev.
casper.test.begin("Demo bionlp-st-ge", 7, function(test) {
	casper.start('http://localhost:8000/dist/demo/bionlp-st-ge/index.html', function() {
		test.assertHttpStatus(200);
		test.assertTitle("", "title is no");
		test.assertExist('.textae-control', "one control is exits");
		test.assertExist('.textae-editor', "one edtor is exits");
		test.assertExist('#editor1__S0_15', "span is rendered");
		test.assertExist('#Geditor1__S0_15', "entity is rendered");
		test.assertExist('._jsPlumb_connector', "relation is rendered");
	}).run(function() {
		test.done();
	});
});