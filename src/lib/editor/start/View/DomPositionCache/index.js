import GridPosition from './GridPosition'
import SpanAndEntityPosition from './SpanAndEntityPosition'
import LesserMap from './LesserMap'

// Utility functions for get positions of DOM elemnts.
export default function(editor, entityModel) {
  // The editor has onry one position cache.
  editor.postionCache = editor.postionCache || create(editor, entityModel)
  return editor.postionCache
}

function create(editor, entityModel) {
  const gridPosition = new GridPosition(entityModel)
  const spanAndEntityPosition = new SpanAndEntityPosition(
    editor,
    entityModel,
    gridPosition
  )
  const grid = new GridApi(gridPosition)
  const relation = new RelationApi()

  return Object.assign(spanAndEntityPosition, grid, relation)
}

function GridApi(gridPosition) {
  return {
    gridPositionCache: gridPosition,
    getGrid: gridPosition.get,
    setGrid: gridPosition.set
  }
}

function RelationApi() {
  const newCache = new LesserMap()

  // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
  const api = {
    connectCache: newCache,
    toConnect: (relationId) => newCache.get(relationId)
  }

  return api
}
