import compileHandlebarsTemplate from '../../compileHandlebarsTemplate'
import Control from '../Control'
import { htmlTemplate } from './htmlTemplate'
import transitWriteButtonImage from './transitWriteButtonImage'

// The control is a control bar in an editor.
export default class ControlBar extends Control {
  constructor(editor) {
    const template = compileHandlebarsTemplate(htmlTemplate)
    super(template, editor)
  }

  transitWriteButtonImage(transitButtons) {
    transitWriteButtonImage(super.el, transitButtons)
  }
}
