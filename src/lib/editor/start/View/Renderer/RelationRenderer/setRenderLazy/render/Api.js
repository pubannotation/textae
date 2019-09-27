import LABEL from '../../../../../LABEL'

// Extend module for jsPlumb.Connection.
export default function() {
  return {
    bindClickAction(onClick) {
      this.bind('click', onClick)
      this.getOverlay(LABEL.id).bind('click', (label, event) =>
        onClick(label.component, event)
      )
    }
  }
}
