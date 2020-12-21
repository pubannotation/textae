import buttonConfig from '../../buttonConfig'
import compileHandlebarsTemplate from '../../compileHandlebarsTemplate'

export default function (htmlTemplate) {
  const template = compileHandlebarsTemplate(htmlTemplate)
  return template(buttonConfig.mapForControl)
}
