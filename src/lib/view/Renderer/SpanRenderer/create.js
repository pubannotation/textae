import getBigBrother from './getBigBrother';
import renderSingleSpan from './renderSingleSpan';
import renderClassOfSpan from './renderClassOfSpan';
import renderEntitiesOfSpan from './renderEntitiesOfSpan';
import destroyChildrenSpan from './destroyChildrenSpan';

export default create;

// Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
function create(span, annotationData, isBlockFunc, renderEntityFunc) {
    destroyChildrenSpan(span);

    let bigBrother = getBigBrother(span, annotationData.span.topLevel());
    renderSingleSpan(span, bigBrother);

    renderClassOfSpan(
        span,
        isBlockFunc
    );

    renderEntitiesOfSpan(
        span,
        annotationData.entity.get,
        renderEntityFunc
    );

    renderChildresnSpan(
        span,
        span => create(span, annotationData, isBlockFunc, renderEntityFunc)
    );
}

function renderChildresnSpan(span, create) {
    span.children
        .forEach(create);

    return span;
}
