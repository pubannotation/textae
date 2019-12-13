import Control from '../Control'
import { htmlTemplate } from './htmlTemplate'
import transitButtonImage from './transitButtonImage'

// The control is a control bar in an editor.
export default class extends Control {
  constructor(eventEmitter) {
    super(htmlTemplate, eventEmitter)
  }

  transitButtonImage(transitButtons) {
    transitButtonImage(super.el, transitButtons)
  }
}
