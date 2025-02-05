import delgate from 'delegate'
import debounce300 from './debounce300'

export default function bindChangeBoundaryDetection(
  content,
  menuState,
  configuration
) {
  delgate(
    content,
    '.textae-editor__setting-dialog__boundary-detection-text',
    'change',
    debounce300(({ target }) => {
      if (target.checked) {
        configuration.boundarydetection = true
        menuState.push('boundary detection')
      } else {
        configuration.boundarydetection = false
        menuState.release('boundary detection')
      }
    })
  )
}
