import ModificationRenderer from './ModificationRenderer';
import getDisplayName from './getDisplayName';
import {
    EventEmitter as EventEmitter
}
from 'events';

var // Arrange a position of the pane to center entities when entities width is longer than pane width.
    arrangePositionOfPane = function(pane) {
        var paneWidth = pane.outerWidth();
        var entitiesWidth = pane.find('.textae-editor__entity').toArray().map(function(e) {
            return e.offsetWidth;
        }).reduce(function(pv, cv) {
            return pv + cv;
        }, 0);

        pane.css({
            'left': entitiesWidth > paneWidth ? (paneWidth - entitiesWidth) / 2 : 0
        });
    },
    uri = require('../../util/uri'),
    idFactory = require('../../util/idFactory'),
    domUtil = require('../../util/domUtil');

module.exports = function(editor, model, typeContainer, gridRenderer) {
    var modification = new ModificationRenderer(model.annotationData),
        getTypeDom = function(spanId, type) {
            return $('#' + idFactory.makeTypeId(spanId, type));
        },
        doesSpanHasNoEntity = function(spanId) {
            return model.annotationData.span.get(spanId).getTypes().length === 0;
        },
        removeEntityElement = function() {
            var doesTypeHasNoEntity = function(entity, typeName) {
                return model.annotationData.span.get(entity.span).getTypes().filter(function(type) {
                    return type.name === typeName;
                }).length === 0;
            };

            return function(entity) {
                // Get old type from Dom, Because the entity may have new type when changing type of the entity.
                var oldType = domUtil.selector.entity.get(entity.id, editor).remove().attr('type');

                // Delete type if no entity.
                if (doesTypeHasNoEntity(entity, oldType)) {
                    getTypeDom(entity.span, oldType).remove();
                } else {
                    // Arrage the position of TypePane, because number of entities decrease.
                    arrangePositionOfPane(getTypeDom(entity.span, oldType).find('.textae-editor__entity-pane'));
                }
            };
        }(),
        // An entity is a circle on Type that is an endpoint of a relation.
        // A span have one grid and a grid can have multi types and a type can have multi entities.
        // A grid is only shown when at least one entity is owned by a correspond span.
        create = function() {
            //render type unless exists.
            var getTypeElement = function() {
                    var getUri = function(type) {
                            if (uri.isUri(type)) {
                                return type;
                            } else if (typeContainer.entity.getUri(type)) {
                                return typeContainer.entity.getUri(type);
                            }
                        },
                        // A Type element has an entity_pane elment that has a label and will have entities.
                        createEmptyTypeDomElement = function(spanId, type) {
                            var typeId = idFactory.makeTypeId(spanId, type);

                            // The EntityPane will have entities.
                            var $entityPane = $('<div>')
                                .attr('id', 'P-' + typeId)
                                .addClass('textae-editor__entity-pane');

                            // The label over the span.
                            var $typeLabel = $('<div>')
                                .addClass('textae-editor__type-label')
                                .css({
                                    'background-color': typeContainer.entity.getColor(type),
                                });

                            // Set the name of the label with uri of the type.
                            var uri = getUri(type);
                            if (uri) {
                                $typeLabel.append(
                                    $('<a target="_blank"/>')
                                    .attr('href', uri)
                                    .text(getDisplayName(type))
                                );
                            } else {
                                $typeLabel.text(getDisplayName(type));
                            }

                            return $('<div>')
                                .attr('id', typeId)
                                .addClass('textae-editor__type')
                                .append($typeLabel)
                                .append($entityPane); // Set pane after label because pane is over label.
                        },
                        getGrid = function(spanId) {
                            // Create a grid unless it exists.
                            var $grid = domUtil.selector.grid.get(spanId);
                            if ($grid.length === 0) {
                                return gridRenderer.render(spanId);
                            } else {
                                return $grid;
                            }
                        };

                    return function(spanId, type) {
                        var $type = getTypeDom(spanId, type);
                        if ($type.length === 0) {
                            $type = createEmptyTypeDomElement(spanId, type);
                            getGrid(spanId).append($type);
                        }

                        return $type;
                    };
                }(),
                createEntityElement = function(entity) {
                    var $entity = $('<div>')
                        .attr('id', idFactory.makeEntityDomId(editor, entity.id))
                        .attr('title', entity.id)
                        .attr('type', entity.type)
                        .addClass('textae-editor__entity')
                        .css({
                            'border-color': typeContainer.entity.getColor(entity.type)
                        });

                    // Set css classes for modifications.
                    $entity.addClass(modification.getClasses(entity.id));

                    return $entity;
                };

            return function(entity) {
                // Replace null to 'null' if type is null and undefined too.
                entity.type = String(entity.type);

                // Append a new entity to the type
                var pane = getTypeElement(entity.span, entity.type)
                    .find('.textae-editor__entity-pane')
                    .append(createEntityElement(entity));

                arrangePositionOfPane(pane);
            };
        }(),
        emitter = new EventEmitter(),
        createEntityUnlessBlock = function(entity) {
            if (!typeContainer.entity.isBlock(entity.type)) {
                create(entity);
            }

            emitter.emit('render', entity);

            return entity;
        },
        selector = require('../Selector')(editor, model),
        changeTypeOfExists = function(entity) {
            // Remove an old entity.
            removeEntityElement(entity);

            // Show a new entity.
            createEntityUnlessBlock(entity);

            // Re-select a new entity instance.
            if (model.selectionModel.entity.has(entity.id)) {
                selector.entity.select(entity.id);
            }

            return entity;
        },
        changeModificationOfExists = function(entity) {
            var $entity = domUtil.selector.entity.get(entity.id, editor);
            modification.update($entity, entity.id);
        },
        destroy = function(entity) {
            if (doesSpanHasNoEntity(entity.span)) {
                // Destroy a grid when all entities are remove.
                gridRenderer.remove(entity.span);
            } else {
                // Destroy an each entity.
                removeEntityElement(entity);
            }

            return entity;
        };

    return _.extend(emitter, {
        render: createEntityUnlessBlock,
        change: changeTypeOfExists,
        changeModification: changeModificationOfExists,
        remove: destroy,
        getTypeDom: function(entity) {
            return getTypeDom(entity.span, entity.type);
        }
    });
};
