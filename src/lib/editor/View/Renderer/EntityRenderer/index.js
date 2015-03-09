import ModificationRenderer from '../ModificationRenderer';
import getDisplayName from './getDisplayName';
import {
    EventEmitter as EventEmitter
}
from 'events';
import uri from '../../../../util/uri';
import idFactory from '../../../../util/idFactory';
import domUtil from '../../domUtil';
import Selector from '../../Selector';
import getTypeDom from './getTypeDom';
import create from './create';
import createEntityUnlessBlock from './createEntityUnlessBlock';
import changeTypeOfExists from './changeTypeOfExists';
import removeEntityElement from './removeEntityElement';

export default function(editor, model, typeContainer, gridRenderer) {
    let modification = new ModificationRenderer(model.annotationData),
        emitter = new EventEmitter();

    return _.extend(emitter, {
        render: (entity) => createEntityUnlessBlock(
            editor,
            model.annotationData.namespace,
            typeContainer,
            gridRenderer,
            modification,
            emitter,
            entity
        ),
        change: (entity) => changeTypeOfExists(
            editor,
            model,
            typeContainer,
            gridRenderer,
            modification,
            emitter,
            entity
        ),
        changeModification: (entity) => changeModificationOfExists(
            editor,
            modification,
            entity
        ),
        remove: (entity) => destroy(
            editor,
            model,
            gridRenderer,
            entity
        ),
        getTypeDom: (entity) => getTypeDom(
            entity.span,
            entity.type
        )
    });
}

function destroy(editor, model, gridRenderer, entity) {
    if (doesSpanHasNoEntity(model.annotationData, entity.span)) {
        // Destroy a grid when all entities are remove.
        gridRenderer.remove(entity.span);
    } else {
        // Destroy an each entity.
        removeEntityElement(editor, model.annotationData, entity);
    }

    return entity;
}

function changeModificationOfExists(editor, modification, entity) {
    var $entity = domUtil.selector.entity.get(entity.id, editor);
    modification.update($entity, entity.id);
}

function doesSpanHasNoEntity(annotationData, spanId) {
    return annotationData.span.get(spanId).getTypes().length === 0;
}
