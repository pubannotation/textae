import Handlebars from 'handlebars';

// Make a group of buttons that is headed by the separator.
const source = `
    <span class="textae-control__title">
        <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    {{#buttonGroup}}
    <span class="textae-control__separator"></span>
        {{#buttonList}}
    <span class="textae-control__icon textae-control__{{buttonType}}-button {{buttonType}}" title="{{title}}"></span>
        {{/buttonList}}
    {{/buttonGroup}}
    `;

let tepmlate = Handlebars.compile(source);

export default function($control, buttonMap) {
    $control[0].innerHTML = tepmlate(buttonMap);
}
