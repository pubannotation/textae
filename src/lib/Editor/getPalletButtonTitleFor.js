import { MODE } from '../MODE'

export default function getPalletButtonTitleFor(mode) {
  switch (mode) {
    case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
    case MODE.EDIT_DENOTATION_WITH_RELATION:
      return 'Term Configuration'
    case MODE.EDIT_BLOCK_WITHOUT_RELATION:
    case MODE.EDIT_BLOCK_WITH_RELATION:
      return 'Block Configuration'
    case MODE.EDIT_RELATION:
      return 'Relation Configuration'
    default:
      return ''
  }
}
