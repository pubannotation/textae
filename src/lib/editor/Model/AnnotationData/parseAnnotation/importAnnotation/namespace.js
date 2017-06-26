import importSource from './importSource'
import _ from 'underscore'

export default function(destination, source) {
  // Clone source to prevet changing orignal data.
  importSource(
      [destination], namespace => _.extend({}, namespace),
      source
  )
}
