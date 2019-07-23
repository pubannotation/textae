// import _ from 'underscore'

// Overlay styles for jsPlubm connections.
const NORMAL_ARROW = {
  width: 7,
  length: 9,
  location: 1,
  id: 'normal-arrow'
}

const HOVER_ARROW = {
  width: 14,
  length: 18,
  location: 1,
  id: 'hover-arrow',
}

export default {
  NORMAL_ARROW,
  resetArrows(connect) {
    const ids = getArrowIds(connect)
    removeArrows(connect, ids)
    addArrows(connect, ids)
  },
  showBigArrow(connect) {
    if (hasHoverArrow(connect)) {
      return connect
    }

    // Remove a normal arrow and add a new big arrow.
    // Because an arrow is out of position if hideOverlay and showOverlay is used.
    removeArrow(NORMAL_ARROW.id, connect)
    addArrow(HOVER_ARROW.id, connect)

    return connect
  },
  hideBigArrow(connect) {
    if (hasNormalArrow(connect)) {
      return connect
    }

    removeArrow(HOVER_ARROW.id, connect)
    addArrow(NORMAL_ARROW.id, connect)

    return connect
  }
}

function addArrow(id, connect) {
  if (id === NORMAL_ARROW.id) {
    connect.addOverlay(['Arrow', NORMAL_ARROW])
  } else if (id === HOVER_ARROW.id) {
    connect.addOverlay(['Arrow', HOVER_ARROW])
  }
  return connect
}

function addArrows(connect, arrows) {
  arrows.forEach((id) => addArrow(id, connect))
  return arrows
}

function getArrowIds(connect) {
  return connect.getOverlays()
    .filter((overlay) => overlay.type === 'Arrow')
    .map((arrow) => arrow.id)
}

function hasNormalArrow(connect) {
  return connect.getOverlay(NORMAL_ARROW.id)
}

function hasHoverArrow(connect) {
  return connect.getOverlay(HOVER_ARROW.id)
}

function removeArrow(id, connect) {
  connect.removeOverlay(id)
  return connect
}

function removeArrows(connect, arrows) {
  arrows.forEach((id) => removeArrow(id, connect))
  return arrows
}

