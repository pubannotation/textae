import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids';

export default function(getSpan, getGridOfSpan, typeContainer, typeGapValue, span) {
    if (span.children.length === 0) {
        return stickGridOnSpan(getSpan, getGridOfSpan, span);
    } else {
        return pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span);
    }
}

function stickGridOnSpan(getSpan, getGridOfSpan, span) {
    var spanPosition = getSpan(span.id);

    return {
        'top': spanPosition.top - getGridOfSpan(span.id).outerHeight(),
        'left': spanPosition.left
    };
}

function pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span) {
    // Culculate the height of the grid include descendant grids, because css style affects slowly.
    var spanPosition = getSpan(span.id),
        descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue);

    return {
        'top': spanPosition.top - descendantsMaxHeight,
        'left': spanPosition.left
    };
}
