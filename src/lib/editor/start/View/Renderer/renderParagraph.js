import Handlebars from 'handlebars'
import getTextBox from '../getTextBox'

const source = `
{{#paragraphs}}
<p class="textae-editor__body__text-box__paragraph-margin">
    <span class="textae-editor__body__text-box__paragraph" id="{{id}}">{{text}}</span>
</p>
{{/paragraphs}}
`

const tepmlate = Handlebars.compile(source)

export default function(editor, paragraphs) {
  getTextBox(editor[0]).innerHTML = tepmlate({
    paragraphs
  })
}
