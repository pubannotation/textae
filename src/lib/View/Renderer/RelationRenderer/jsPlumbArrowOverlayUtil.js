var // Overlay styles for jsPlubm connections.
    NORMAL_ARROW = {
        width: 7,
        length: 9,
        location: 1,
        id: 'normal-arrow'
    },
    HOVER_ARROW = {
        width: 14,
        length: 18,
        location: 1,
        id: 'hover-arrow',
    },
    addArrow = function(id, connect) {
        if (id === NORMAL_ARROW.id) {
            connect.addOverlay(['Arrow', NORMAL_ARROW]);
        } else if (id === HOVER_ARROW.id) {
            connect.addOverlay(['Arrow', HOVER_ARROW]);
        }
        return connect;
    },
    addArrows = function(connect, arrows) {
        arrows.forEach(function(id) {
            addArrow(id, connect);
        });
        return arrows;
    },
    getArrowIds = function(connect) {
        return connect.getOverlays()
            .filter(function(overlay) {
                return overlay.type === 'Arrow';
            })
            .map(function(arrow) {
                return arrow.id;
            });
    },
    hasNormalArrow = function(connect) {
        return connect.getOverlay(NORMAL_ARROW.id);
    },
    hasHoverArrow = function(connect) {
        return connect.getOverlay(HOVER_ARROW.id);
    },
    removeArrow = function(id, connect) {
        connect.removeOverlay(id);
        return connect;
    },
    removeArrows = function(connect, arrows) {
        arrows.forEach(function(id) {
            removeArrow(id, connect);
        });
        return arrows;
    },
    resetArrows = function(connect) {
        _.compose(
            _.partial(addArrows, connect),
            _.partial(removeArrows, connect),
            getArrowIds
        )(connect);
    },
    addNormalArrow = _.partial(addArrow, NORMAL_ARROW.id),
    addHoverArrow = _.partial(addArrow, HOVER_ARROW.id),
    removeNormalArrow = _.partial(removeArrow, NORMAL_ARROW.id),
    removeHoverArrow = _.partial(removeArrow, HOVER_ARROW.id),
    // Remove a normal arrow and add a new big arrow.
    // Because an arrow is out of position if hideOverlay and showOverlay is used.
    switchHoverArrow = _.compose(
        addHoverArrow,
        removeNormalArrow
    ),
    switchNormalArrow = _.compose(
        addNormalArrow,
        removeHoverArrow
    );

module.exports = {
    NORMAL_ARROW: NORMAL_ARROW,
    resetArrows: resetArrows,
    showBigArrow: function(connect) {
        // Do not add a big arrow twice when a relation has been selected during hover.
        if (hasHoverArrow(connect)) {
            return connect;
        }

        return switchHoverArrow(connect);
    },
    hideBigArrow: function(connect) {
        // Already affected
        if (hasNormalArrow(connect))
            return connect;

        return switchNormalArrow(connect);
    }
};
