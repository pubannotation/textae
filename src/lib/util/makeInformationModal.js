module.exports = function() {
	//this is bound object.
	var showModal = function(className, obj) {
		var getModal = function() {
			var $modal = $('.' + this.className);
			// add modal unless exists
			if ($modal.length === 0) {
				$modal = $('<div>')
					.addClass('textae__information-modal')
					.addClass(this.className)
					.hide();
				this.addContentsFunc.call($modal);
				$('body').append($modal);
			}
			return $modal;
		};

		var setPositionCenter = function($modal) {
			var $window = $(window);
			$modal.css({
				'position': 'absolute',
				'top': ($window.height() - $modal.height()) / 2 + $window.scrollTop(),
				'left': ($window.width() - $modal.width()) / 2 + $window.scrollLeft()
			});
		};

		//close other dialogs
		$('.textae__information-modal').hide();

		//show at center
		var $modal = getModal.call(this);
		setPositionCenter($modal);
		$modal.show();
	};

	//this is bound object.
	var hideModal = function(className) {
		$('.' + this.className).hide();
	};

	//expected param has className and addContentsFunc.
	var bindObject = function(param) {
		return {
			show: showModal.bind(param),
			hide: hideModal.bind(param)
		};
	};

	//close modal when modal clicked.
	$(function() {
		$('body').on('mouseup', '.textae__information-modal', function() {
			$(this).hide();
		});
	});

	return bindObject;
}();