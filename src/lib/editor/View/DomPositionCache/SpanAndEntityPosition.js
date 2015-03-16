import idFactory from '../../idFactory';
import CachedGetterFactory from './CachedGetterFactory';

let factory = new CachedGetterFactory();

export default function (editor, entityModel, gridPositionCache) {
    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    let cachedGetSpan = factory((spanId) => getSpan(editor, spanId)),
        cachedGetEntity = factory((entityId) => getEntity(editor, entityModel, gridPositionCache, entityId));

    return {
        reset: factory.clearAllCache,
        getSpan: cachedGetSpan,
        getEntity: cachedGetEntity
    };
}

function getSpan(editor, spanId) {
    let span = editor[0].querySelector('#' + spanId);
    if (!span) {
        throw new Error("span is not renderd : " + spanId);
    }

    return {
        top: span.offsetTop,
        left: span.offsetLeft,
        width: span.offsetWidth,
        height: span.offsetHeight,
        center: span.offsetLeft + span.offsetWidth / 2
    };
}

function getEntity(editor, entityModel, gridPositionCache, entityId) {
    let entity = editor[0].querySelector('#' + idFactory.makeEntityDomId(editor, entityId));
    if (!entity) {
        throw new Error("entity is not rendered : " + entityId);
    }

    let spanId = entityModel.get(entityId).span,
        gridPosition = gridPositionCache.get(spanId);

    return {
        top: gridPosition.top + entity.offsetTop,
        center: gridPosition.left + entity.offsetLeft + entity.offsetWidth / 2,
    };
}
