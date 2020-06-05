import commonValidate from './commonValidate'
import SelectionWrapper from '../../../ElementEditor/SelectionWrapper'

export default function(annotationData, spanConfig, selection) {
  return (
    new SelectionWrapper(selection).isFocusNodeInSpan &&
    commonValidate(annotationData, spanConfig, selection)
  )
}
