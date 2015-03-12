import Handlebars from 'handlebars';
import getElement from './getElement';
import getEditorBody from './getEditorBody';

const source = `
{{#paragraphs}}
<p class="textae-editor__body__text-box__paragraph-margin">
    <span class="textae-editor__body__text-box__paragraph" id="{{id}}">{{text}}</span>
</p>
{{/paragraphs}}
`;

let tepmlate = Handlebars.compile(source);

// Get the display area for text and spans.
let getTextBox = _.compose(
    _.partial(getElement, 'div', 'textae-editor__body__text-box'),
    getEditorBody
);

export default function(editor, paragraphs) {
    getTextBox(editor)[0].innerHTML = createTaggedSourceDoc(paragraphs);
}

// the Souce document has multi paragraphs that are splited by '\n'.
function createTaggedSourceDoc(paragraphs) {
    return tepmlate({
        paragraphs: paragraphs
    });
}
