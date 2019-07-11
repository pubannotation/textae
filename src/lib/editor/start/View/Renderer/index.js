import DomPositionCache from '../DomPositionCache'
import Initiator from './Initiator'

export default function(editor, annotationData, selectionModel, buttonStateHelper, typeDefinition, typeGap, relationRenderer) {
  const domPositionCache = new DomPositionCache(editor, annotationData.entity),
    api = {
      init: new Initiator(
        domPositionCache,
        relationRenderer,
        buttonStateHelper,
        typeGap,
        editor,
        annotationData,
        selectionModel,
        typeDefinition
      ),
      renderLazyRelationAll: () => relationRenderer.renderLazyRelationAll()
    }

  return api
}
