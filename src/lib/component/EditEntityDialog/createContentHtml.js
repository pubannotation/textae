import toEntityHTML from './toEntityHTML'

export default function (content) {
  return toEntityHTML(content.value, content.label, content.attributes)
}
