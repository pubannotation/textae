import 'jquery'
import 'sticky-kit'

const extendedJQuery = global.jQuery.noConflict(true)

export default function (cb) {
  extendedJQuery(cb).stick_in_parent()
}
