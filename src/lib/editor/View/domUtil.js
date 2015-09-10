var idFactory = require('../idFactory');

module.exports = {
    selector: {
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
