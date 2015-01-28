var idFactory = require('../util/IdFactory');

module.exports = {
    selector: {
        span: {
            get: function(spanId) {
                return $('#' + spanId);
            }
        },
        entity: {
            get: function(entityId, editor) {
                return $('#' + idFactory.makeEntityDomId(editor, entityId));
            }
        },
        grid: {
            get: function(spanId) {
                return $('#G' + spanId);
            }
        },
    }
};
