import Handlebars from 'handlebars'

// Make a group of buttons that is headed by the separator.
const source = `
    <p class="textae-control__title">
        <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </p>
    {{#buttonGroup}}
    <p class="textae-control__separator"></p>
        {{#list}}
    <p class="textae-control__icon textae-control__{{type}}-button">{{title}}</p>
        {{/list}}
    {{/buttonGroup}}
    `

const template = Handlebars.compile(source)

export default function(control, buttonMap) {
  control.innerHTML = template(buttonMap)
}
