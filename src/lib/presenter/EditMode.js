var typeGap = function() {
	var seed = {
			instanceHide: 0,
			instanceShow: 2
		},
		set = function(mode, val) {
			typeGap[mode] = val;
			return val;
		},
		api = _.extend({}, seed),
		capitalize = require('../util/capitalize');

	_.each(seed, function(val, key) {
		api['set' + capitalize(key)] = _.partial(set, key);
	});

	return api;
}();

module.exports = function(model, viewMode, typeEditor, updateDisplay) {
	var api = {
			init: function() {
				_.extend(api, state.init);
			},
			get typeGap() {
				return viewMode.getTypeGapValue();
			},
			changeTypeGap: viewMode.changeTypeGap,
			get lineHeight() {
				return Math.floor(viewMode.getLineHeight());
			},
			changeLineHeight: viewMode.changeLineHeight
		},
		resetView = function() {
			typeEditor.hideDialogs();
			model.selectionModel.clear();
		},
		transition = {
			toTerm: function() {
				resetView();

				typeEditor.editEntity();
				viewMode.setTerm();
				viewMode.setEditable(true);
				viewMode.changeTypeGap(typeGap.instanceHide);

				updateDisplay();

				_.extend(api, state.termCentric);
			},
			toInstance: function() {
				resetView();

				typeEditor.editEntity();
				viewMode.setInstance();
				viewMode.setEditable(true);
				viewMode.changeTypeGap(typeGap.instanceShow);

				updateDisplay();

				_.extend(api, state.instanceRelation);
			},
			toRelation: function() {
				resetView();

				typeEditor.editRelation();
				viewMode.setRelation();
				viewMode.setEditable(true);
				viewMode.changeTypeGap(typeGap.instanceShow);

				updateDisplay();

				_.extend(api, state.relationEdit);
			},
			toViewTerm: function() {
				resetView();

				typeEditor.noEdit();
				viewMode.setTerm();
				viewMode.setEditable(false);
				viewMode.changeTypeGap(typeGap.instanceHide);

				updateDisplay();

				_.extend(api, state.viewTerm);
			},
			toViewInstance: function() {
				resetView();

				typeEditor.noEdit();
				viewMode.setInstance();
				viewMode.setEditable(false);
				viewMode.changeTypeGap(typeGap.instanceShow);

				updateDisplay();

				_.extend(api, state.viewInstance);
			}
		},
		// Calculate the line-height when the view-mode set
		failTransit = function() {
			throw new Error('fail transition.');
		},
		changeTypeGapInstanceHide = _.compose(viewMode.changeTypeGap, typeGap.setInstanceHide),
		changeTypeGapInstanceShow = _.compose(viewMode.changeTypeGap, typeGap.setInstanceShow),
		state = {
			init: _.extend({}, transition, {
				name: 'Init'
			}),
			termCentric: _.extend({}, transition, {
				name: 'Term Centric',
				toTerm: failTransit,
				changeTypeGap: changeTypeGapInstanceHide,
				showInstance: false
			}),
			instanceRelation: _.extend({}, transition, {
				name: 'Instance / Relation',
				toInstance: failTransit,
				changeTypeGap: changeTypeGapInstanceShow,
				showInstance: true
			}),
			relationEdit: _.extend({}, transition, {
				name: 'Relation Edit',
				toRelation: failTransit,
				changeTypeGap: changeTypeGapInstanceShow,
				showInstance: true
			}),
			viewTerm: _.extend({}, transition, {
				name: 'View Only',
				toTerm: failTransit,
				toInstance: transition.toViewInstance,
				toRelation: failTransit,
				toViewTerm: failTransit,
				changeTypeGap: changeTypeGapInstanceHide,
				showInstance: false
			}),
			viewInstance: _.extend({}, transition, {
				name: 'View Only',
				toTerm: transition.toViewTerm,
				toInstance: failTransit,
				toRelation: failTransit,
				toViewInstance: failTransit,
				changeTypeGap: changeTypeGapInstanceShow,
				showInstance: true
			})
		};

	return api;
};