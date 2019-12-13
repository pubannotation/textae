import Handlebars from 'handlebars'
import { buttonMap } from './buttonMap'

export default function(htmlTemplate) {
  const template = Handlebars.compile(htmlTemplate)
  return template(buttonMap)
}
