import Handlebars from 'handlebars'

// See: https://stackoverflow.com/questions/24334639/handlebars-if-statement-with-index-some-value
Handlebars.registerHelper('ifSecond', function (index, options) {
  if (index == 1) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

const source = `
{{#each this}}
  {{#ifSecond @index}}
  <div class="textae-editor__valiondate-dialog__content">
      <h1>Track annatations will be merged to the root anntations.</h1>
    </div>
  {{/ifSecond}}
  <div class="textae-editor__valiondate-dialog__content">
    <h2>{{name}}</h2>

    {{#if wrongRangeDenotations}}
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
          {{#wrongRangeDenotations}}
          <tr>
            <td>{{id}}</td>
            <td class="alert">{{span.begin}}</td>
            <td class="alert">{{span.end}}</td>
            <td>{{obj}}</td>
          </tr>
          {{/wrongRangeDenotations}}
        </tbody>
      </table>
    {{/if}}

    {{#if outOfTextDenotations}}
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
          {{#outOfTextDenotations}}
          <tr>
            <td>{{id}}</td>
            <td class="alert">{{span.begin}}</td>
            <td class="alert">{{span.end}}</td>
            <td>{{obj}}</td>
          </tr>
          {{/outOfTextDenotations}}
        </tbody>
      </table>
    {{/if}}

    {{#if boundaryCrossingSpans}}
      <table>
        <caption>Denotations or Typesettings with boundary-cross.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="sourceProperty">source property</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>style/obj</th>
          </tr>
        </thead>
        <tbody>
          {{#boundaryCrossingSpans}}
          <tr>
            <td>{{id}}</td>
            <td>{{sourceProperty}}</td>
            <td class="alert">{{span.begin}}</td>
            <td class="alert">{{span.end}}</td>
            <td>{{style}}{{obj}}</td>
          </tr>
          {{/boundaryCrossingSpans}}
        </tbody>
      </table>
    {{/if}}

    {{#if referencedEntitiesDoNotExist}}
      <table>
        <caption>Referenced entities do not exist.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="sourceProperty">source property</th>
            <th class="referencedItem">subj</th>
            <th>pred</th>
            <th class="referencedItem">obj</th>
          </tr>
        </thead>
        <tbody>
          {{#referencedEntitiesDoNotExist}}
          <tr>
            <td>{{id}}</td>
            <td>{{sourceProperty}}</td>
            <td{{#if alertSubj}} class="alert"{{/if}}>{{subj}}</td>
            <td>{{pred}}</td>
            <td{{#if alertObj}} class="alert"{{/if}}>{{obj}}</td>
          </tr>
          {{/referencedEntitiesDoNotExist}}
        </tbody>
      </table>
    {{/if}}

    {{#if duplicatedAttributes}}
      <table>
        <caption>Dupulicated attributes.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="referencedItem">subj</th>
            <th>pred</th>
            <th class="referencedItem">obj</th>
          </tr>
        </thead>
        <tbody>
          {{#duplicatedAttributes}}
          <tr>
            <td>{{id}}</td>
            <td class="alert">{{subj}}</td>
            <td>{{pred}}</td>
            <td class="alert">{{obj}}</td>
          </tr>
          {{/duplicatedAttributes}}
        </tbody>
      </table>
    {{/if}}
  </div>
{{/each}}
`

const template = Handlebars.compile(source)

export default function (content) {
  return template(content)
}
