import isSimple from '../isSimple'
import { MODE } from '../../../../../MODE'

export default function (stateMachine, annotationData) {
  if (isSimple(annotationData)) {
    stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
  } else {
    stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
  }
}
