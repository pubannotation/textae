import ModificationRenderer from '../ModificationRenderer'
import getAnnotationBox from '../getAnnotationBox'
import DomPositionCache from '../../DomPositionCache'
import Connect from './Connect'
import arrangePositionAll from './arrangePositionAll'
import makeJsPlumbInstance from './makeJsPlumbInstance'
import LabelOverlay from './LabelOverlay'
import removeRelation from './removeRelation'
import connectorStrokeStyle from './connectorStrokeStyle'
import render from './render'

const POINTUP_LINE_WIDTH = 3

module.exports = function(editor, annotationData, selectionModel, typeContainer) {
  // Init a jsPlumb instance.
  const modification = new ModificationRenderer(annotationData)
  const domPositionCache = new DomPositionCache(editor, annotationData.entity)

  // Cache a connect instance.
  function cache(connect) {
    const relationId = connect.relationId
    const domPositionCache = new DomPositionCache(editor, annotationData.entity)
    domPositionCache.connectCache.set(relationId, connect)

    return connect
  }

  function isGridPrepared(relationId) {
    if (!annotationData.relation.get(relationId))
      return undefined

    const domPositionCache = new DomPositionCache(editor, annotationData.entity),
      relation = annotationData.relation.get(relationId)

    return domPositionCache.gridPositionCache.isGridPrepared(relation.subj) &&
      domPositionCache.gridPositionCache.isGridPrepared(relation.obj)
  }

  function filterGridExists(connect) {
    // The grid may be destroyed when the spans was moved repetitively by undo or redo.
    if (!isGridPrepared(connect.relationId)) {
      return undefined
    }
    return connect
  }

  // Create a dummy relation when before moving grids after creation grids.
  // Because a jsPlumb error occurs when a relation between same points.
  // And entities of same length spans was same point before moving grids.
  function renderLazy(relation) {
    function extendRelationId(relation) {
      return Object.assign(relation, {
        relationId: relation.id
      })
    }

    function renderIfGridExists(relation) {
      if (filterGridExists(relation) && relation.render) {
        render(jsPlumbInstance, editor, annotationData, typeContainer, modification, relation, cache)
      }
    }

    function extendDummyApiToCreateRlationWhenGridMoved(relation) {
      return Object.assign(relation, {
        render() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              try {
                renderIfGridExists(relation)
                resolve(relation)
              } catch (error) {
                reject(error)
              }
            }, 0)
          })
        }
      })
    }

    extendRelationId(relation)
    extendDummyApiToCreateRlationWhenGridMoved(relation)
    cache(relation)
  }

  function changeType(relation) {
    const connect = new Connect(editor, annotationData, relation.id)
    const strokeStyle = connectorStrokeStyle(annotationData, typeContainer, relation.id)

    // The connect may be an object for lazyRender instead of jsPlumb.Connection.
    // This occurs when changing types and deletes was reverted.
    if (connect instanceof jsPlumb.Connection) {
      if (selectionModel.relation.has(relation.id)) {
        // Re-set style of the line and arrow if selected.
        strokeStyle.lineWidth = POINTUP_LINE_WIDTH
      }
      connect.setPaintStyle(strokeStyle)

      new LabelOverlay(connect).setLabel('[' + relation.id + '] ' + relation.type)
    }
  }

  function changeJsModification(relation) {
    const connect = new Connect(editor, annotationData, relation.id)

    // A connect may be an object before it rendered.
    if (connect instanceof jsPlumb.Connection) {
      modification.update(new LabelOverlay(connect).getElement(), relation.id)
    }
  }

  const jsPlumbInstance = makeJsPlumbInstance(getAnnotationBox(editor))

  return {
    arrangePositionAll: () => arrangePositionAll(editor, annotationData, selectionModel, jsPlumbInstance),
    reset: function() {
      jsPlumbInstance.reset()
      domPositionCache.connectCache.clear()
    },
    render: renderLazy,
    change: changeType,
    changeAll: () => {
      annotationData.relation.all().map((relation) => {
        changeType(relation)
      })
    },
    changeModification: changeJsModification,
    remove: (relation) => removeRelation(editor, annotationData, relation, jsPlumbInstance, domPositionCache)
  }
}
