import showVilidationDialog from '../component/showVilidationDialog'

export default function(annotationData, history) {
  annotationData.on('all.change', (_, __, reject) => {
    history.resetAllHistories()
    showVilidationDialog(self, reject)
  })
}
