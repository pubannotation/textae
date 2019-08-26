import showValidationDialog from '../component/showValidationDialog'

export default function(annotationData, history) {
  annotationData.on('all.change', (_, __, reject) => {
    history.resetAllHistories()
    showValidationDialog(reject)
  })
}
