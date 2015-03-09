import getAnnotationBox from './getAnnotationBox';
import domUtil from '../../../util/domUtil';

export default function(editor, domPositionCache) {
    var container = getAnnotationBox(editor),
        render = _.partial(createGrid, domPositionCache, container),
        destroyGrid = function(spanId) {
            domUtil.selector.grid.get(spanId).remove();
            domPositionCache.gridPositionCache.remove(spanId);
        };

    return {
        render: render,
        remove: destroyGrid
    };
}

function createGrid(domPositionCache, container, spanId) {
    var spanPosition = domPositionCache.getSpan(spanId),
        $grid = $('<div>')
        .attr('id', 'G' + spanId)
        .addClass('textae-editor__grid')
        .addClass('hidden')
        .css({
            'width': spanPosition.width
        });

    //append to the annotation area.
    container.append($grid);

    return $grid;
}
