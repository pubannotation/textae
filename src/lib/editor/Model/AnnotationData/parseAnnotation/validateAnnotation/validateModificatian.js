import validate from './validate'
import isContains from './isContains'
import _ from 'underscore'

export default function(denotations, relations, modifications) {
  const resultModification = validate(
      modifications,
        isContains, {
          property: 'obj',
          dictionary: _.union(denotations, relations)
        })

  return {
    accept: resultModification.accept,
    reject: {
      modification: resultModification.reject,
      hasError: resultModification.reject.length !== 0
    }
  }
}
