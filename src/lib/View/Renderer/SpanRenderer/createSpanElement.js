export default function(span) {
    let element = document.createElement('span');
    element.setAttribute('id', span.id);
    element.setAttribute('title', span.id);
    element.setAttribute('class', 'textae-editor__span');
    return element;
}
