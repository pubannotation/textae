import $ from 'jquery'
import EntityPallet from './component/EntityPallet'

export default function() {
  const editor = $('.textae-editor')
  const entityPallet = new EntityPallet(editor)
  editor[0].appendChild(entityPallet.el)
  entityPallet.show()
}
