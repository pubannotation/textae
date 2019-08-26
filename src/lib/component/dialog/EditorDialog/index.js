import Dialog from '../Dialog'
import getOption from './getOption'

export default function(id, title, el, option) {
  const openOption = getOption(option)
  const $dialog = new Dialog(openOption, id, title, el)

  return $dialog
}
