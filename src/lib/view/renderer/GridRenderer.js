var createGrid = function(domPositionCache, container, spanId) {
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
},
domUtil = require('../../util/domUtil');

module.exports = function(editor, domPositionCache) {
    var init = function(container) {
        api.render = _.partial(createGrid, domPositionCache, container);
    },
    destroyGrid = function(spanId) {
        domUtil.selector.grid.get(spanId).remove();
        domPositionCache.gridPositionCache.remove(spanId);
    },
    api = {
        init: init,
        // The render is set at init.
        render: null,
        remove: destroyGrid
    };

    return api;
};
