var Modal = function(self) {
		var $modal = $('.' + self.className);
		// add modal unless exists
		if ($modal.length === 0) {
			$modal = $('<div>')
				.addClass('textae__information-modal')
				.addClass(self.className)
				.hide();
			self.addContentsFunc.call($modal);
			$('body').append($modal);
		}
		return $modal;
	},
	setPositionCenter = function($modal) {
		var $window = $(window);
		$modal.css({
			'position': 'absolute',
			'top': ($window.height() - $modal.height()) / 2 + $window.scrollTop(),
			'left': ($window.width() - $modal.width()) / 2 + $window.scrollLeft()
		});
	},
	show = function(self) {
		//close other dialogs
		$('.textae__information-modal').hide();

		//show at center
		var $modal = new Modal(self);
		setPositionCenter($modal);
		$modal.show();
	},
	hide = function(className) {
		$('.' + className).hide();
	};

//close modal when modal clicked.
$(function() {
	$('body').on('mouseup', '.textae__information-modal', function() {
		$(this).hide();
	});
});

//expected param has className and addContentsFunc.
module.exports = function(param) {
	return {
		show: _.partial(show, param),
		hide: _.partial(hide, param.className)
	};
};