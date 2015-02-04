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
                var number = i + 1,
                    prefix = `track${ number }_`,
                    reject = parseAnnotation(span, entity, relation, modification, paragraph, text, track, prefix);

                reject.name = `Track ${ number } annotaiton.`;
                return reject;
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
                annotation);

        annotationReject.name = 'Root annotation.';

        return [annotationReject].concat(tracksReject);
    },
    setNewData = function(dataStore, annotation) {
        parseBaseText(dataStore.paragraph, annotation.text);

        dataStore.sourceDoc = annotation.text;
        dataStore.config = annotation.config;

        return parseDennotation(dataStore, annotation);
    };

module.exports = setNewData;
