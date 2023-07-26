import alertifyjs from 'alertifyjs'
import Tool from './Tool'
import toEditor from './toEditor'
import API from './API'

export const tool = new Tool()

export default function () {
  // Set position of toast messages.
  alertifyjs.set('notifier', 'position', 'top-right')

  return Array.from(document.querySelectorAll('.textae-editor'))
    .filter((element) => !element.dataset.textaeInitialized)
    .map((element) => toEditor(tool, element))
    .map((editor) => new API(editor))
}
