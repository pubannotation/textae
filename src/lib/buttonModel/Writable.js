// Maintainance a state of which the save button is able to be push.

import Observable from "observ"

export default function() {
  let isDataModified = false,
    o = new Observable(false)

  o.forceModified = function(val) {
    o.set(val)
    isDataModified = val
  }

  o.update = function(val) {
    o.set(isDataModified || val)
  }

  return o
}
