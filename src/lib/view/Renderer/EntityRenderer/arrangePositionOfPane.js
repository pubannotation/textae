// Arrange a position of the pane to center entities when entities width is longer than pane width.
export default function(pane) {
    var paneWidth = pane.outerWidth();
    var entitiesWidth = pane.find('.textae-editor__entity').toArray().map(function(e) {
        return e.offsetWidth;
    }).reduce(function(pv, cv) {
        return pv + cv;
    }, 0);

    pane.css({
        'left': entitiesWidth > paneWidth ? (paneWidth - entitiesWidth) / 2 : 0
    });
}
