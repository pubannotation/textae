// Usage sample: getUrlParameters(location.search). 
module.exports = function(urlQuery) {
	// Remove ? at top.
	var queryString = urlQuery ? String(urlQuery).replace(/^\?(.*)/, '$1') : '';

	// Convert to array if exists
	var querys = queryString.length > 0 ? queryString.split('&') : [];

	return querys
		.map(function(param) {
			// Convert string "key=value" to object.
			var vals = param.split('=');
			return {
				key: vals[0],
				val: vals[1]
			};
		}).reduce(function(a, b) {
			// Convert [{key: 'abc', val: '123'},...] to { abc: 123 ,...}
			// Set value true if val is not set.
			a[b.key] = b.val ? b.val : true;
			return a;
		}, {});
};