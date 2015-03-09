import getElement from './getElement';
import getEditorBody from './getEditorBody';

var // Get the display area for text and spans.
    getTextBox = _.compose(
        _.partial(getElement, 'div', 'textae-editor__body__text-box'),
        getEditorBody
    ),
    // the Souce document has multi paragraphs that are splited by '\n'.
    createTaggedSourceDoc = function(sourceDoc, paragraphs) {
        //set sroucedoc tagged <p> per line.
        return sourceDoc.split("\n").map(function(content, index) {
            return '<p class="textae-editor__body__text-box__paragraph-margin">' +
                '<span class="textae-editor__body__text-box__paragraph" id="' +
                paragraphs[index].id +
                '" >' +
                content +
                '</span></p>';
        }).join("\n");
    },
    renderSourceDocument = function(editor, sourceDoc, paragraphs) {
        getTextBox(editor)[0].innerHTML = createTaggedSourceDoc(sourceDoc, paragraphs);
    };

export default renderSourceDocument;
