import DomPositionCache from '../DomPositionCache'
import Initiator from './Initiator'

export default function(editor, annotationData, selectionModel, buttonStateHelper, typeContainer, typeGap, relationRenderer) {
  const domPositionCaChe = new DomPositionCache(editor, annotationData.entity),
    api = {
      init: new Initiator(
        domPositionCaChe,
        relationRenderer,
        buttonStateHelper,
        typeGap,
        editor,
        annotationData,
        selectionModel,
        typeContainer
      ),
      arrangeRelationPositionAll: relationRenderer.arrangePositionAll,
      renderLazyRelationAll: relationRenderer.renderLazyRelationAll
    }

  return api
}
