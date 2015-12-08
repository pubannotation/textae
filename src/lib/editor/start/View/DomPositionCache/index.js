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
  let gridPosition = new GridPosition(entityModel),
    spanAndEntityPosition = new SpanAndEntityPosition(editor, entityModel, gridPosition),
    grid = new GridApi(gridPosition),
    relation = new RelationApi()

  return _.extend(
    spanAndEntityPosition,
    grid,
    relation
  )
}

function GridApi(gridPosition) {
  return {
    gridPositionCache: gridPosition,
    getGrid: gridPosition.get,
    setGrid: gridPosition.set,
  }
}

function RelationApi() {
  let newCache = new LesserMap(),
    // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
    api = {
      connectCache: newCache,
      toConnect: relationId => newCache.get(relationId)
    }

  return api
}
