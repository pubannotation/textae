var isEmpty = function(str) {
	return !str || str === "";
};

module.exports = function() {
	return {
		getSync: function(url) {
			if (isEmpty(url)) {
				return;
			}

			var result = null;
			$.ajax({
				type: "GET",
				url: url,
				async: false
			}).done(function(data) {
				result = data;
			});
			return result;
		},

		getAsync: function(url, dataHandler, finishHandler) {
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
					alert("connection failed.");
				})
				.always(function(data) {
					if (finishHandler !== undefined) {
						finishHandler();
					}
				});
		},

		post: function(url, data, successHandler, failHandler, finishHandler) {
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
		}
	};
}();