// Extend module for jsPlumb.Connection.
export default function() {
  return {
    bindClickAction(onClick) {
      this.bind('click', onClick)
    }
  }
}
