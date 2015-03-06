import Handlebars from 'handlebars';
import BUTTON_MAP from './buttonMap';

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

export default function($control) {
    $control[0].innerHTML = tepmlate(BUTTON_MAP);

    // Return {read: 1, write: 1, undo: 1, redo: 1, replicate: 1…}
    return BUTTON_MAP.buttonGroup
        .reduce((hash, group) => {
            return group.buttonList
                .reduce((hash, button) => {
                    // Trick for merge outer parametr to enable or disable buttons
                    hash[button.buttonType] = 1;
                    return hash;
                }, hash);
        }, {});
}
