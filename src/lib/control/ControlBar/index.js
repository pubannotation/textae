import Control from '../Control'
import { htmlTemplate } from './htmlTemplate'
import transitWriteButtonImage from './transitWriteButtonImage'

// The control is a control bar in an editor.
export default class ControlBar extends Control {
  constructor(editor) {
    super(htmlTemplate, editor)
  }

  transitWriteButtonImage(transitButtons) {
    transitWriteButtonImage(super.el, transitButtons)
  }
}
