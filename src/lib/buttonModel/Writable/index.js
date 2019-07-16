// Maintainance a state of which the save button is able to be push.
import Observable from "observ"
import updateWritable from './updateWritable'

export default function() {
  let isDataModified = false
  const o = new Observable(false)

  return Object.assign(o, {
    forceModified(val) {
      o.set(val)
      isDataModified = val
    },
    update(val) {
      o.set(isDataModified || val)
    },
    updateWithModify(multitrack, reject) {
      updateWritable(this, multitrack, reject)
    }
  })
}
