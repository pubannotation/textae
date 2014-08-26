module.exports = function(model) {
	var reduce2hash = require('../util/reduce2hash'),
		DEFAULT_TYPE = 'something',
		TypeContainer = function(getActualTypesFunction, defaultColor) {
			var definedTypes = {},
				defaultType = DEFAULT_TYPE;

			return {
				setDefinedTypes: function(newDefinedTypes) {
					definedTypes = newDefinedTypes;
				},
				getDeinedTypes: function() {
					return _.extend({}, definedTypes);
				},
				setDefaultType: function(name) {
					defaultType = name;
				},
				getDefaultType: function() {
					return defaultType || this.getSortedNames()[0];
				},
				getColor: function(name) {
					return definedTypes[name] && definedTypes[name].color || defaultColor;
				},
				getUri: function(name) {
					return definedTypes[name] && definedTypes[name].uri || undefined;
				},
				getSortedNames: function() {
					if (getActualTypesFunction) {
						var typeCount = getActualTypesFunction()
							.concat(Object.keys(definedTypes))
							.reduce(function(a, b) {
								a[b] = a[b] ? a[b] + 1 : 1;
								return a;
							}, {});

						// Sort by number of types, and by name if numbers are same.
						var typeNames = Object.keys(typeCount);
						typeNames.sort(function(a, b) {
							var diff = typeCount[b] - typeCount[a];
							return diff !== 0 ? diff :
								a > b ? 1 :
								b < a ? -1 :
								0;
						});

						return typeNames;
					} else {
						return [];
					}
				}
			};
		},
		setContainerDefinedTypes = function(container, newDefinedTypes) {
			// expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
			if (newDefinedTypes !== undefined) {
				container.setDefinedTypes(newDefinedTypes.reduce(reduce2hash, {}));
				container.setDefaultType(
					newDefinedTypes.filter(function(type) {
						return type["default"] === true;
					}).map(function(type) {
						return type.name;
					}).shift() || DEFAULT_TYPE
				);
			}
		},
		entityContainer = _.extend(new TypeContainer(model.annotationData.entity.types, '#77DDDD'), {
			isBlock: function(type) {
				// console.log(type, entityContainer.getDeinedTypes(), entityContainer.getDeinedTypes()[type]);
				var definition = entityContainer.getDeinedTypes()[type];
				return definition && definition.type && definition.type === 'block';
			}
		}),
		relationContaier = new TypeContainer(model.annotationData.relation.types, '#555555');

	return {
		entity: entityContainer,
		setDefinedEntityTypes: _.partial(setContainerDefinedTypes, entityContainer),
		relation: relationContaier,
		setDefinedRelationTypes: _.partial(setContainerDefinedTypes, relationContaier)
	};
};