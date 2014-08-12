module.exports = function() {
	var emitter = require('../util/extendBindable')({}),
		$pallet = function() {
			return $('<div>')
				.addClass("textae-editor__type-pallet")
				.append($('<table>'))
				.css('position', 'fixed')
				.on('click', '.textae-editor__type-pallet__entity-type__label', function() {
					emitter.trigger('type.select', $(this).attr('label'));
				})
				.on('change', '.textae-editor__type-pallet__entity-type__radio', function() {
					emitter.trigger('default-type.select', $(this).attr('label'));
				})
				.hide();
		}(),
		show = function() {
			var makePalletRow = function(typeContainer) {
					var makeRadioButton = function(typeName) {
						// The event handler is bound direct,because jQuery detects events of radio buttons directly only.
						var $radioButton = $('<input>')
							.addClass('textae-editor__type-pallet__entity-type__radio')
							.attr({
								'type': 'radio',
								'name': 'etype',
								'label': typeName
							});

						// Select the radio button if it is default type.
						if (typeName === typeContainer.getDefaultType()) {
							$radioButton.attr({
								'title': 'default type',
								'checked': 'checked'
							});
						}
						return $radioButton;
					};

					var makeLink = function(uri) {
						if (uri) {
							return $('<a>')
								.attr({
									'href': uri,
									'target': '_blank'
								})
								.append($('<span>').addClass('textae-editor__type-pallet__link'));
						}
					};

					var wrapTd = function($element) {
						if ($element) {
							return $('<td>').append($element);
						} else {
							return $('<td>');
						}
					};

					var makeColumn1 = _.compose(wrapTd, makeRadioButton);

					var makeColumn2 = function(typeName) {
						return $('<td>')
							.addClass('textae-editor__type-pallet__entity-type__label')
							.attr('label', typeName)
							.text(typeName);
					};

					var makeColumn3 = _.compose(wrapTd, makeLink, typeContainer.getUri);

					return typeContainer.getSortedNames().map(function(typeName) {
						var $column1 = makeColumn1(typeName);
						var $column2 = makeColumn2(typeName);
						var $column3 = makeColumn3(typeName);

						return $('<tr>')
							.addClass('textae-editor__type-pallet__entity-type')
							.css({
								'background-color': typeContainer.getColor(typeName)
							})
							.append([$column1, $column2, $column3]);
					});
				},
				reuseOldPallet = function($pallet) {
					var $oldPallet = $('.textae-editor__type-pallet');
					if ($oldPallet.length !== 0) {
						return $oldPallet.find('table').empty().end().css('width', 'auto');
					} else {
						// Append the pallet to body to show on top.
						$("body").append($pallet);
						return $pallet;
					}
				},
				appendRows = function(palletConfig, $pallet) {
					return $pallet.find("table")
						.append(makePalletRow(palletConfig.typeContainer))
						.end();
				},
				setMaxHeight = function($pallet) {
					// Show the scrollbar-y if the height of the pallet is same witch max-height.
					if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
						return $pallet.css('overflow-y', 'scroll');
					} else {
						return $pallet.css('overflow-y', '');
					}
				},
				show = function($pallet, palletConfig, point) {
					if (palletConfig.typeContainer && palletConfig.typeContainer.getSortedNames().length > 0) {
						var fillPallet = _.compose(setMaxHeight, _.partial(appendRows, palletConfig), reuseOldPallet);

						// Move the pallet to mouse.
						fillPallet($pallet)
							.css(point)
							.show();
					}
				};

			return show;
		}();

	return _.extend(emitter, {
		show: _.partial(show, $pallet),
		hide: $pallet.hide.bind($pallet)
	});
};