var getDetectBoundaryFunc = function(modeAccordingToButton, spanConfig) {
        if (modeAccordingToButton['boundary-detection'].value())
            return spanConfig.isDelimiter;
        else
            return null;
    },
    replicate = function(command, annotationData, modeAccordingToButton, spanConfig, spanId, entity) {
        var detectBoundaryFunc = getDetectBoundaryFunc(modeAccordingToButton, spanConfig);

        if (spanId) {
            command.invoke(
                [command.factory.spanReplicateCommand(
                    entity.getDefaultType(),
                    annotationData.span.get(spanId),
                    detectBoundaryFunc
                )]
            );
        } else {
            alert('You can replicate span annotation when there is only span selected.');
        }
    };

module.exports = replicate;
