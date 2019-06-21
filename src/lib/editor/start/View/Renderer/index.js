import DomPositionCache from '../DomPositionCache'
import Initiator from './Initiator'

export default function(editor, annotationData, selectionModel, buttonStateHelper, typeContainer, typeGap, relationRenderer) {
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
        typeContainer
      ),
      renderLazyRelationAll: () => relationRenderer.renderLazyRelationAll()
    }

  return api
}
