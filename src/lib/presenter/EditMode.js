var typeGap = function() {
	var seed = {
			instanceHide: 0,
			instanceShow: 2
		},
		set = function(mode, val) {
			return typeGap[mode] = val;
		},
		api = _.extend({}, seed),
		capitalize = require('../util/capitalize');

	_.each(seed, function(val, key) {
		api['set' + capitalize(key)] = _.partial(set, key);
	});

	return api;
}();

module.exports = function(model, view, typeEditor) {
	var api = {
			init: function() {
				_.extend(api, state.init);
			},
			get typeGap() {
				return view.viewModel.viewMode.typeGapValue;
			},
			changeTypeGap: view.helper.changeTypeGap,
			get lineHeight() {
				return Math.floor(view.helper.getLineHeight());
			},
			changeLineHeight: view.helper.changeLineHeight
		},
		resetView = function() {
			typeEditor.hideDialogs();
			model.selectionModel.clear();
		},
		transition = {
			toTerm: function() {
				resetView();

				typeEditor.editEntity();
				view.viewModel.viewMode.setTerm();
				view.viewModel.viewMode.setEditable(true);
				view.helper.changeTypeGap(typeGap.instanceHide);

				_.extend(api, state.termCentric);
			},
			toInstance: function() {
				resetView();

				typeEditor.editEntity();
				view.viewModel.viewMode.setInstance();
				view.viewModel.viewMode.setEditable(true);
				view.helper.changeTypeGap(typeGap.instanceShow);

				_.extend(api, state.instanceRelation);
			},
			toRelation: function() {
				resetView();

				typeEditor.editRelation();
				view.viewModel.viewMode.setRelation();
				view.viewModel.viewMode.setEditable(true);
				view.helper.changeTypeGap(typeGap.instanceShow);

				_.extend(api, state.relationEdit);
			},
			toViewTerm: function() {
				resetView();

				typeEditor.noEdit();
				view.viewModel.viewMode.setTerm();
				view.viewModel.viewMode.setEditable(false);
				view.helper.changeTypeGap(typeGap.instanceHide);

				_.extend(api, state.viewTerm);
			},
			toViewInstance: function() {
				resetView();

				typeEditor.noEdit();
				view.viewModel.viewMode.setInstance();
				view.viewModel.viewMode.setEditable(false);
				view.helper.changeTypeGap(typeGap.instanceShow);

				_.extend(api, state.viewInstance);
			}
		},
		// Calculate the line-height when the view-mode set
		failTransit = function() {
			throw new Error('fail transition.');
		},
		changeTypeGapInstanceHide = _.compose(view.helper.changeTypeGap, typeGap.setInstanceHide),
		changeTypeGapInstanceShow = _.compose(view.helper.changeTypeGap, typeGap.setInstanceShow),
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