import { MODE } from '../../MODE'

export default function(pushButtons, mode) {
  switch (mode) {
    case MODE.VIEW_WITHOUT_RELATION:
      pushButtons.getButton('view').value(true)
      pushButtons.getButton('term').value(false)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(true)
      break
    case MODE.VIEW_WITH_RELATION:
      pushButtons.getButton('view').value(true)
      pushButtons.getButton('term').value(false)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(false)
      break
    case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      pushButtons.getButton('view').value(false)
      pushButtons.getButton('term').value(true)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(true)
      break
    case MODE.EDIT_DENOTATION_WITH_RELATION:
      pushButtons.getButton('view').value(false)
      pushButtons.getButton('term').value(true)
      pushButtons.getButton('relation').value(false)
      pushButtons.getButton('simple').value(false)
      break
    case MODE.EDIT_RELATION:
      pushButtons.getButton('view').value(false)
      pushButtons.getButton('term').value(false)
      pushButtons.getButton('relation').value(true)
      pushButtons.getButton('simple').value(false)
      break
    default:
      throw `unknown edit mode!${mode}`
  }
}
