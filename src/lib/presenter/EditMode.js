var typeGap = function() {
	var seed = {
			instanceHide: 0,
			instanceShow: 1
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
			// Init as TermCentricState
			init: function() {
				transition.toTerm();
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
		notTransit = view.helper.redraw,
		state = {
			termCentric: _.extend({}, transition, {
				name: 'Term Centric',
				toTerm: notTransit,
				changeTypeGap: _.compose(view.helper.changeTypeGap, typeGap.setInstanceHide),
				showInstance: false
			}),
			instanceRelation: _.extend({}, transition, {
				name: 'Instance / Relation',
				toInstance: notTransit,
				changeTypeGap: _.compose(view.helper.changeTypeGap, typeGap.setInstanceShow),
				showInstance: true
			}),
			relationEdit: _.extend({}, transition, {
				name: 'Relation Edit',
				toRelation: notTransit,
				changeTypeGap: _.compose(view.helper.changeTypeGap, typeGap.setInstanceShow),
				showInstance: true
			}),
			viewTerm: _.extend({}, transition, {
				name: 'View Only',
				toTerm: notTransit,
				toInstance: transition.toViewInstance,
				toRelation: notTransit,
				toViewTerm: notTransit,
				changeTypeGap: _.compose(view.helper.changeTypeGap, typeGap.setInstanceHide),
				showInstance: false
			}),
			viewInstance: _.extend({}, transition, {
				name: 'View Only',
				toTerm: transition.toViewTerm,
				toInstance: notTransit,
				toRelation: notTransit,
				toViewInstance: notTransit,
				changeTypeGap: _.compose(view.helper.changeTypeGap, typeGap.setInstanceShow),
				showInstance: true
			})
		};

	return api;
};