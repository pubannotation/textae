import DomPositionCache from './DomPositionCache'

// Utility functions for get positions of DOM elemnts.
export default function(editor, entityModel) {
  // The editor has onry one position cache.
  editor.postionCache =
    editor.postionCache || new DomPositionCache(editor, entityModel)
  return editor.postionCache
}
