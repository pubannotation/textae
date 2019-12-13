import BUTTON_MAP from '../buttonMap'
import makeButtons from './makeButtons'

export default function() {
  const el = document.createElement('div')
  el.classList.add('textae-control')
  el.classList.add('textae-control-bar')
  makeButtons(el, BUTTON_MAP)
  return el
}
