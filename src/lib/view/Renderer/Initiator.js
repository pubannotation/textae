import renderSourceDocument from './renderSourceDocument';
import getAnnotationBox from './getAnnotationBox';
import RenderAll from './RenderAll';
import renderModification from './renderModification';
import {
    EventEmitter as EventEmitter
}
from 'events';
import TypeStyle from '../TypeStyle';

export default function(domPositionCaChe, spanRenderer, gridRenderer, entityRenderer, relationRenderer, buttonStateHelper, typeGap) {
    var emitter = new EventEmitter(),
        triggerChange = _.debounce(function() {
            emitter.emit('change');
        }, 100),
        triggerChangeAfter = _.partial(_.compose, triggerChange);

    entityRenderer.on('render', entity => entityRenderer.getTypeDom(entity).css(new TypeStyle(typeGap())));

    return (editor, annotationData, selectionModel) => {
        var renderAll = new RenderAll(editor, domPositionCaChe, spanRenderer, relationRenderer),
            entityToSpan = function(entity) {
                return annotationData.span.get(entity.span);
            },
            updateSpanAfter = _.partial(_.compose, triggerChange, spanRenderer.change, entityToSpan),
            renderModificationEntityOrRelation = (modification) => {
                renderModification(annotationData, 'relation', modification, relationRenderer, buttonStateHelper);
                renderModification(annotationData, 'entity', modification, entityRenderer, buttonStateHelper);
            };

        initChildren(editor, gridRenderer, relationRenderer);

        annotationData
            .on('change-text', function(params) {
                renderSourceDocument(editor, params.sourceDoc, params.paragraphs);
                emitter.emit('text.change');
            })
            .on('all.change', triggerChangeAfter(selectionModel.clear, renderAll))
            .on('span.add', triggerChangeAfter(spanRenderer.render))
            .on('span.remove', triggerChangeAfter(spanRenderer.remove))
            .on('span.remove', _.compose(selectionModel.span.remove, modelToId))
            .on('entity.add', function(entity) {
                // Add a now entity with a new grid after the span moved.
                spanRenderer.change(entityToSpan(entity), domPositionCaChe.reset);
                entityRenderer.render(entity);
                triggerChange();
            })
            .on('entity.change', updateSpanAfter(entityRenderer.change))
            .on('entity.remove', updateSpanAfter(entityRenderer.remove))
            .on('entity.remove', _.compose(selectionModel.entity.remove, modelToId))
            .on('relation.add', triggerChangeAfter(relationRenderer.render))
            .on('relation.change', relationRenderer.change)
            .on('relation.remove', relationRenderer.remove)
            .on('relation.remove', _.compose(selectionModel.relation.remove, modelToId))
            .on('modification.add', renderModificationEntityOrRelation)
            .on('modification.remove', renderModificationEntityOrRelation);

        return emitter;
    };
}

function initChildren(editor, gridRenderer, relationRenderer) {
    var container = getAnnotationBox(editor);
    gridRenderer.init(container);
    relationRenderer.init(container);
}

function modelToId(modelElement) {
    return modelElement.id;
}
