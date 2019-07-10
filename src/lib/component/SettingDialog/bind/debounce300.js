import _ from 'underscore'

export default function(func) {
  return _.debounce(func, 300)
}
