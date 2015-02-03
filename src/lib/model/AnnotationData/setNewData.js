var parseAnnotation = require('./parseAnnotation'),
    parseBaseText = function(paragraph, sourceDoc) {
        paragraph.addSource(sourceDoc);
    },
    parseTracks = function(span, entity, relation, modification, paragraph, text, annotation) {
        if (!annotation.tracks) return [];

        var tracks = annotation.tracks;
        delete annotation.tracks;

        return tracks
            .map(function(track, i) {
                var prefix = 'track' + (i + 1) + '_';

                return parseAnnotation(span, entity, relation, modification, paragraph, text, track, prefix);
            });
    },
    parseDennotation = function(dataStore, annotation) {
        var tracksReject = parseTracks(
                dataStore.span,
                dataStore.entity,
                dataStore.relation,
                dataStore.modification,
                dataStore.paragraph,
                annotation.text,
                annotation
            ),
            annotationReject = parseAnnotation(
                dataStore.span,
                dataStore.entity,
                dataStore.relation,
                dataStore.modification,
                dataStore.paragraph,
                annotation.text,
                annotation),
            hasError = tracksReject
            .reduce(function(result, track) {
                return result || track.hasError;
            }, false) || annotationReject.hasError;

        return {
            tracks: tracksReject,
            annotation: annotationReject,
            hasError: hasError
        };
    },
    setNewData = function(dataStore, annotation) {
        parseBaseText(dataStore.paragraph, annotation.text);

        dataStore.sourceDoc = annotation.text;
        dataStore.config = annotation.config;

        return parseDennotation(dataStore, annotation);
    };

module.exports = setNewData;
