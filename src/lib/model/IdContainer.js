module.exports = function(kindName) {
	var extendBindable = require('../util/extendBindable'),
		selected = {},
		triggerChange = function() {
			api.trigger(kindName + '.change');
		};

	var api = extendBindable({
		name: kindName,
		add: function(id) {
			selected[id] = id;
			api.trigger(kindName + '.add', id);
			triggerChange();
		},
		all: function() {
			return _.toArray(selected);
		},
		has: function(id) {
			return _.contains(selected, id);
		},
		some: function() {
			return _.some(selected);
		},
		single: function() {
			var array = api.all();
			return array.length === 1 ? array[0] : null;
		},
		toggle: function(id) {
			if (api.has(id)) {
				api.remove(id);
			} else {
				api.add(id);
			}
		},
		remove: function(id) {
			delete selected[id];
			api.trigger(kindName + '.remove', id);
			triggerChange();
		},
		clear: function() {
			if (!api.some()) return;

			_.each(api.all(), api.remove);
			selected = {};
			triggerChange();
		}
	});

	return api;
};