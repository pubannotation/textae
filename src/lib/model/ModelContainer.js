var createId = function(prefix, getIdsFunction) {
	var ids = getIdsFunction()
		.filter(function(id) {
			return id[0] === prefix;
		})
		.map(function(id) {
			return id.slice(1);
		});

	// The Math.max retrun -Infinity when the second argument array is empty.
	return prefix + (ids.length === 0 ? 1 : Math.max.apply(null, ids) + 1);
};

module.exports = function(eventEmitter, prefix, mappingFunction) {
	var contaier = {},
		getIds = function() {
			return Object.keys(contaier);
		},
		getNewId = _.partial(createId, prefix ? prefix.charAt(0).toUpperCase() : '', getIds),
		add = function(model) {
			// Overwrite to revert
			model.id = model.id || getNewId();
			contaier[model.id] = model;
			return model;
		},
		concat = function(collection) {
			if (collection) collection.forEach(add);
		},
		get = function(id) {
			return contaier[id];
		},
		all = function() {
			return _.map(contaier, _.identity);
		},
		clear = function() {
			contaier = {};
		};

	return {
		name: prefix,
		setSource: function(source) {
			if (!_.isFunction(mappingFunction)) {
				throw new Error('Set the mappingFunction by the constructor to use the method "ModelContainer.setSource".');
			}

			clear();
			concat(mappingFunction(source));
		},
		add: function(model, doAfter) {
			var newModel = add(model);
			if (_.isFunction(doAfter)) doAfter();

			return eventEmitter.trigger(prefix + '.add', newModel);
		},
		get: get,
		all: all,
		some: function() {
			return _.some(contaier);
		},
		types: function() {
			return all().map(function(model) {
				return model.type;
			});
		},
		changeType: function(id, newType) {
			var model = get(id);
			model.type = newType;
			eventEmitter.trigger(prefix + '.change', model);
			return model;
		},
		remove: function(id) {
			var model = contaier[id];
			if (model) {
				delete contaier[id];
				eventEmitter.trigger(prefix + '.remove', model);
			}
			return model;
		},
		clear: clear
	};
};