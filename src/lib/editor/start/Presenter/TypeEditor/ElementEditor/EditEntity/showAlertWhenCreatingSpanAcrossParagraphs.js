import SelectionWrapper from '../SelectionWrapper'
import clearTextSelection from '../../clearTextSelection'

export default function() {
  if (new SelectionWrapper(window.getSelection()).showAlertIfOtherParagraph()) {
    clearTextSelection()
  }
}
