import { state as editModeState } from '../../state'

export default function(pushButtons, mode) {
  switch (mode) {
    case editModeState.VIEW_WITHOUT_RELATION:
      pushButtons.getButton('view').value(true)
      pushButtons.getButton('term').value(false)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(true)
      break
    case editModeState.VIEW_WITH_RELATION:
      pushButtons.getButton('view').value(true)
      pushButtons.getButton('term').value(false)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(false)
      break
    case editModeState.EDIT_DENOTATION_WITHOUT_RELATION:
      pushButtons.getButton('view').value(false)
      pushButtons.getButton('term').value(true)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(true)
      break
    case editModeState.EDIT_DENOTATION_WITH_RELATION:
      pushButtons.getButton('view').value(false)
      pushButtons.getButton('term').value(true)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(false)
      break
    case editModeState.EDIT_RELATION:
      pushButtons.getButton('view').value(false)
      pushButtons.getButton('term').value(false)
      pushButtons.getButton('relation').value(true)
      pushButtons.getButton('simple').value(false)
      break
    default:
      throw `unknown edit mode!${mode}`
  }
}
