import Handlebars from 'handlebars'
import hasError from '../editor/Model/AnnotationData/parseAnnotation/validateAnnotation/Reject/hasError'
import EditorDialog from './dialog/EditorDialog'

const source = `
    <div class="textae-editor__valiondate-dialog__content">
        <h2>{{name}}</h2>
        {{#if denotationHasLength}}
            <table>
                <caption>Wrong range.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationHasLength}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationHasLength}}
                </tbody>
            </table>
        {{/if}}
        {{#if denotationInText}}
            <table>
                <caption>Out of text.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationInText}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationInText}}
                </tbody>
            </table>
        {{/if}}
        {{#if denotationIsNotCrossing}}
            <table>
                <caption>Spans with boundary-cross.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationIsNotCrossing}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationIsNotCrossing}}
                </tbody>
            </table>
        {{/if}}
        {{#if denotationInParagraph}}
            <table>
                <caption>Spans across paragraphs (newline-delimited).</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="range">begin</th>
                        <th class="range">end</th>
                        <th>obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#denotationInParagraph}}
                    <tr>
                        <td>{{id}}</td>
                        <td class="alert">{{span.begin}}</td>
                        <td class="alert">{{span.end}}</td>
                        <td>{{obj}}</td>
                    </tr>
                    {{/denotationInParagraph}}
                </tbody>
            </table>
        {{/if}}
        {{#if referencedItems}}
            <table>
                <caption>Referenced items do not exist.</caption>
                <thead>
                    <tr>
                        <th class="id">id</th>
                        <th class="referencedItem">subj</th>
                        <th>pred</th>
                        <th class="referencedItem">obj</th>
                    </tr>
                </thead>
                <tbody>
                    {{#referencedItems}}
                    <tr>
                        <td>{{id}}</td>
                        <td{{#if alertSubj}} class="alert"{{/if}}>{{subj}}</td>
                        <td>{{pred}}</td>
                        <td{{#if alertObj}} class="alert"{{/if}}>{{obj}}</td>
                    </tr>
                    {{/referencedItems}}
                </tbody>
            </table>
        {{/if}}
    </div>`
const mergeMessage = `
        <div class="textae-editor__valiondate-dialog__content">
            <h1>Track annatations will be merged to the root anntations.</h1>
        </div>`

const tepmlate = Handlebars.compile(source)

export default function(rejects) {
  if (!hasError(rejects)) return

  const el = document.createElement('div')
  const $dialog = new EditorDialog(
    'textae.dialog.validation',
    'The following erroneous annotations ignored',
    el,
    {
      noCancelButton: true,
      height: 450
    }
  )

  updateContent($dialog[0].firstChild, rejects)
  $dialog.open()
}

function updateContent(content, rejects) {
  content.innerHTML = ''

  rejects
    .map(transformToReferenceObjectError)
    .map(tepmlate)
    .forEach((html, index) => {
      if (index === 1) {
        content.insertAdjacentHTML('beforeend', mergeMessage)
      }

      content.insertAdjacentHTML('beforeend', html)
    })

  return content
}

function transformToReferenceObjectError(reject) {
  // Combine rejects for referenced object errer.
  reject.referencedItems = reject.relationObj
    .map((relation) => {
      relation.alertObj = true
      return relation
    })
    .concat(
      reject.relationSubj.map((relation) => {
        relation.alertSubj = true
        return relation
      })
    )
    .concat(
      reject.modification.map((modification) => {
        modification.subj = '-'
        modification.alertObj = true
        return modification
      })
    )

  return reject
}
