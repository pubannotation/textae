import Handlebars from 'handlebars'

// Make a group of buttons that is headed by the separator.
const source = `
    <span class="textae-control__title">
        <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    {{#buttonGroup}}
    <span class="textae-control__separator"></span>
        {{#list}}
    <span class="textae-control__icon textae-control__{{type}}-button" title="{{title}}"></span>
        {{/list}}
    {{/buttonGroup}}
    `

const tepmlate = Handlebars.compile(source)

export default function(control, buttonMap) {
  control.innerHTML = tepmlate(buttonMap)
}
