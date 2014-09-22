var isEmpty = function(str) {
		return !str || str === "";
	},
	getAsync = function(url, dataHandler, failedHandler) {
		if (isEmpty(url)) {
			return;
		}

		$.ajax({
			type: "GET",
			url: url,
			cache: false
		})
			.done(function(data) {
				if (dataHandler !== undefined) {
					dataHandler(data);
				}
			})
			.fail(function(res, textStatus, errorThrown) {
				if (failedHandler !== undefined) {
					failedHandler();
				}
			});
	},
	post = function(url, data, successHandler, failHandler, finishHandler) {
		if (isEmpty(url)) {
			return;
		}

		console.log("POST data", data);

		$.ajax({
			type: "post",
			url: url,
			contentType: "application/json",
			data: data,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		})
			.done(successHandler)
			.fail(failHandler)
			.always(finishHandler);
	};

module.exports = function() {
	return {
		getAsync: getAsync,
		post: post
	};
}();