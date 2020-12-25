import dohtml from 'dohtml'
import createRangeToSpan from '../createRangeToSpan'

export default function (span) {
  const targetRange = createRangeToSpan(span)
  const spanElement = dohtml.create(`
    <div id="${span.id}" title="${span.id}" class="textae-editor__block"></div>
  `)

  targetRange.surroundContents(spanElement)
}
