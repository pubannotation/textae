import Handlebars from 'handlebars'
import buttonConfig from '../../buttonConfig'

export default function(htmlTemplate) {
  const template = Handlebars.compile(htmlTemplate)
  return template(buttonConfig.mapForControl)
}
