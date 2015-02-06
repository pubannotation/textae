import capitalize from '../../util/capitalize';
import GridRenderer from './GridRenderer';
import ModificationRenderer from './ModificationRenderer';
import EntityRenderer from './EntityRenderer';
import SpanRenderer from './SpanRenderer';
import RelationRenderer from './RelationRenderer';
import DomPositionCache from '../DomPositionCache';
import renderSourceDocument from './renderSourceDocument';
import getAnnotationBox from './getAnnotationBox';
import RenderAll from './RenderAll';
import {
    EventEmitter as EventEmitter
}
from 'events';

var modelToId = function(modelElement) {
        return modelElement.id;
    },
    renderModification = function(annotationData, modelType, modification, renderer) {
        var target = annotationData[modelType].get(modification.obj);

        if (target) {
            renderer.changeModification(target);
            buttonStateHelper['updateBy' + capitalize(modelType)]();
        }
    };

module.exports = function(editor, model, buttonStateHelper, typeContainer) {
    var domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity),
        gridRenderer = new GridRenderer(editor, domPositionCaChe),
        modificationRenderer = new ModificationRenderer(model.annotationData),
        entityRenderer = new EntityRenderer(editor, model, typeContainer, gridRenderer, modificationRenderer),
        spanRenderer = new SpanRenderer(editor, model, typeContainer, entityRenderer, gridRenderer),
        relationRenderer = new RelationRenderer(editor, model, typeContainer, modificationRenderer),
        init = function(container) {
            gridRenderer.init(container);
            relationRenderer.init(container);
        },
        renderAll = new RenderAll(editor, domPositionCaChe, spanRenderer, relationRenderer),
        api = new EventEmitter(),
        triggerChange = _.debounce(function() {
            api.emit('change');
        }, 100),
        triggerChangeAfter = _.partial(_.compose, triggerChange),
        entityToSpan = function(entity) {
            return model.annotationData.span.get(entity.span);
        },
        updateSpanAfter = function() {
            return _.partial(_.compose, triggerChange, spanRenderer.change, entityToSpan);
        }(),
        renderModificationEntityOrRelation = (modification) => {
            renderModification(model.annotationData, 'relation', modification, relationRenderer);
            renderModification(model.annotationData, 'entity', modification, entityRenderer);
        };

    entityRenderer.bind('render', function(entity) {
        api.emit('entity.render', entity);
        return entity;
    });

    _.extend(api, {
        setModelHandler: function() {
            init(getAnnotationBox(editor));

            model.annotationData
                .on('change-text', function(params) {
                    renderSourceDocument(editor, params.sourceDoc, params.paragraphs);
                })
                .on('all.change', triggerChangeAfter(model.selectionModel.clear, renderAll))
                .on('span.add', triggerChangeAfter(spanRenderer.render))
                .on('span.remove', triggerChangeAfter(spanRenderer.remove))
                .on('span.remove', _.compose(model.selectionModel.span.remove, modelToId))
                .on('entity.add', function(entity) {
                    // Add a now entity with a new grid after the span moved.
                    spanRenderer.change(entityToSpan(entity), domPositionCaChe.reset);
                    entityRenderer.render(entity);
                    triggerChange();
                })
                .on('entity.change', updateSpanAfter(entityRenderer.change))
                .on('entity.remove', updateSpanAfter(entityRenderer.remove))
                .on('entity.remove', _.compose(model.selectionModel.entity.remove, modelToId))
                .on('relation.add', triggerChangeAfter(relationRenderer.render))
                .on('relation.change', relationRenderer.change)
                .on('relation.remove', relationRenderer.remove)
                .on('relation.remove', _.compose(model.selectionModel.relation.remove, modelToId))
                .on('modification.add', renderModificationEntityOrRelation)
                .on('modification.remove', renderModificationEntityOrRelation);
        },
        arrangeRelationPositionAll: relationRenderer.arrangePositionAll,
        renderLazyRelationAll: relationRenderer.renderLazyRelationAll,
        setEntityCss: function(entity, css) {
            entityRenderer
                .getTypeDom(entity)
                .css(css);
        }
    });

    return api;
};
