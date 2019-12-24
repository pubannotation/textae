import template from './template'
import transformToReferenceObjectError from './transformToReferenceObjectError'

export default function createContentHtml(rejects) {
  return template(rejects.map(transformToReferenceObjectError))
}
