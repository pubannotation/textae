import destroy from './destroy';

export default function(span) {
    // Destroy rendered children.
    span.children
        .filter(exists)
        .forEach(destroySpanRecurcive);

    return span;
}

function exists(span) {
    return document.querySelector('#' + span.id) !== null;
}

// Destroy DOM elements of descendant spans.
function destroySpanRecurcive(span) {
    span.children
        .forEach(function(span) {
            destroySpanRecurcive(span);
        });
    destroy(span.id);
}
