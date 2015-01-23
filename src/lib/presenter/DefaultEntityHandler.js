var replicate = require('./replicate'),
    createEntityToSelectedSpan = require('./createEntityToSelectedSpan'),
    DefaultEntityHandler = function(command, annotationData, selectionModel, modeAccordingToButton, spanConfig, entity) {
        return {
            replicate: function() {
                replicate(
                    command,
                    annotationData,
                    modeAccordingToButton,
                    spanConfig,
                    selectionModel.span.single(),
                    entity
                );
            },
            createEntity: function() {
                createEntityToSelectedSpan(
                    command,
                    selectionModel.span.all(),
                    entity
                );
            }
        };
    };

module.exports = DefaultEntityHandler;
