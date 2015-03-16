import Handlebars from 'handlebars';
import getTextBox from '../getTextBox';
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

export default function(editor, paragraphs) {
    getTextBox(editor[0]).innerHTML = createTaggedSourceDoc(paragraphs);
}

// the Souce document has multi paragraphs that are splited by '\n'.
function createTaggedSourceDoc(paragraphs) {
    return tepmlate({
        paragraphs: paragraphs
    });
}
