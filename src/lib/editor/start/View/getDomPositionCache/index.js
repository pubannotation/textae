import DomPositionCache from './DomPositionCache'

// Utility functions for get positions of DOM elemnts.
export default function(editor) {
  // The editor has onry one position cache.
  editor.postionCache = editor.postionCache || new DomPositionCache(editor)
  return editor.postionCache
}
