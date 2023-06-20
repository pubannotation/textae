import { MODE } from '../MODE'

export default function getPalletButtonTitleFor(mode) {
  switch (mode) {
    case MODE.EDIT_DENOTATION:
      return 'Term Configuration'
    case MODE.EDIT_BLOCK:
      return 'Block Configuration'
    case MODE.EDIT_RELATION:
      return 'Relation Configuration'
    default:
      return ''
  }
}
