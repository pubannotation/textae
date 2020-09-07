import validate from './validate'
import isContains from './isContains'

export default function(denotations, attributes) {
  const resultAttributeSubj = validate(attributes, (attr) =>
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
