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
        return {
            tracks: parseTracks(
                dataStore.span,
                dataStore.entity,
                dataStore.relation,
                dataStore.modification,
                dataStore.paragraph,
                annotation.text,
                annotation
            ),
            annotation: parseAnnotation(
                dataStore.span,
                dataStore.entity,
                dataStore.relation,
                dataStore.modification,
                dataStore.paragraph,
                annotation.text,
                annotation)
        };
    },
    setNewData = function(dataStore, annotation) {
        parseBaseText(dataStore.paragraph, annotation.text);

        dataStore.sourceDoc = annotation.text;
        dataStore.config = annotation.config;

        return parseDennotation(dataStore, annotation);
    };

module.exports = setNewData;
