import alertifyjs from 'alertifyjs'

import API from './API'
import Tool from './Tool'
import toEditor from './toEditor'

export const tool = new Tool()

export default function initializeTextAEEditor() {
  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  return Array.from(document.querySelectorAll('.textae-editor'))
    .filter((element) => !element.dataset.textaeInitialized)
    .map((element) => toEditor(tool, element))
    .map((editor) => new API(editor))
}
