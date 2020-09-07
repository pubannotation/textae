import isContains from './isContains'
import ValidationResults from './ValidationResults'

export default function(denotations, attributes) {
  const resultAttributeSubj = new ValidationResults(attributes, (attr) =>
    isContains(denotations, attr, 'subj')
  )
  const errorCount = resultAttributeSubj.rejectedNodes.length

  return {
    accept: resultAttributeSubj.acceptedNodes,
    reject: {
      subj: resultAttributeSubj.rejectedNodes
    },
    hasError: errorCount !== 0
  }
}
