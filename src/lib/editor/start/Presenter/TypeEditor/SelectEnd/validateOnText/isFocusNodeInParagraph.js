import hasParagraphs from '../hasParagraphs'
import getFocusNodeParent from '../getFocusNodeParent'

export default function(selection) {
  return hasParagraphs(getFocusNodeParent(selection))
}
