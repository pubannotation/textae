import GridLayout from './GridLayout';
import {
    EventEmitter as EventEmitter
}
from 'events';

export default function(editor, annotationData, typeContainer, renderer) {
    var emitter = new EventEmitter(),
        gridLayout = new GridLayout(editor, annotationData, typeContainer),
        update = function(typeGapValue) {
            emitter.emit('render.start', editor);

            // Do asynchronous to change behavior of editor.
            // For example a wait cursor or a disabled control.
            _.defer(function() {
                gridLayout.arrangePosition(typeGapValue)
                    .then(renderer.renderLazyRelationAll)
                    .then(renderer.arrangeRelationPositionAll)
                    .then(function() {
                        emitter.emit('render.end', editor);
                    })
                    .catch(function(error) {
                        console.error(error, error.stack);
                    });
            });
        };

    return _.extend(emitter, {
        update: update
    });
}
