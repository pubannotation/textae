var selectionClass = require('./selectionClass');

module.exports = function(editor, model) {
	var domPositionCaChe = require('./DomPositionCache')(editor, model.annotationData.entity),
		domUtil = require('../util/DomUtil')(editor),
		modify = function(type, handle, id) {
			var $elment = domUtil.selector[type].get(id);
			selectionClass[handle + 'Class']($elment);
		},
		selectSpan = _.partial(modify, 'span', 'add'),
		deselectSpan = _.partial(modify, 'span', 'remove'),
		selectEntity = _.partial(modify, 'entity', 'add'),
		deselectEntity = _.partial(modify, 'entity', 'remove'),
		selectRelation = function(relationId) {
			var addUiSelectClass = function(connect) {
					if (connect && connect.select) connect.select();
				},
				selectRelation = _.compose(addUiSelectClass, domPositionCaChe.toConnect);

			selectRelation(relationId);
		},
		deselectRelation = function(relationId) {
			var removeUiSelectClass = function(connect) {
					if (connect && connect.deselect) connect.deselect();
				},
				deselectRelation = _.compose(removeUiSelectClass, domPositionCaChe.toConnect);

			deselectRelation(relationId);
		}, // Select the typeLabel if all entities is selected.
		updateEntityLabel = function(entityId) {
			var $entity = domUtil.selector.entity.get(entityId),
				$typePane = $entity.parent(),
				$typeLabel = $typePane.prev();

			if ($typePane.children().length === $typePane.find('.ui-selected').length) {
				selectionClass.addClass($typeLabel);
			} else {
				selectionClass.removeClass($typeLabel);
			}
		};

	return {
		span: {
			select: selectSpan,
			deselect: deselectSpan
		},
		entity: {
			select: selectEntity,
			deselect: deselectEntity
		},
		relation: {
			select: selectRelation,
			deselect: deselectRelation
		},
		entityLabel: {
			update: updateEntityLabel
		}
	};
};