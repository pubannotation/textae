import Handlebars from 'handlebars'
import wholeHtml from './wholeHtml'
import attributePatial from './attributePartialHtml'

// Since registerPartial is a global configuration, templates that depend on the attribute partial template are defined in this file.
Handlebars.registerPartial('attributePartialTemplate', attributePatial)

export const wholeTemplate = Handlebars.compile(wholeHtml)
