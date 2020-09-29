import getLabelOverlay from '../../../../../getLabelOverlay'

// Extend module for jsPlumb.Connection.
export default function() {
  return {
    bindClickAction(onClick) {
      this.bind('click', onClick)
      getLabelOverlay(this).bind('click', (label, event) =>
        onClick(label.component, event)
      )
    }
  }
}
