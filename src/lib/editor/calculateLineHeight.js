import lineHeight from './view/lineHeight';

export default function(editor, annotationData, typeContainer, typeGap, view) {
    lineHeight.setToTypeGap(editor, annotationData, typeContainer, typeGap());
    view.updateDisplay();
}
