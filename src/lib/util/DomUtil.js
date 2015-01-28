var idFactory = require('../util/IdFactory');

module.exports = function(editor) {
	return {
		selector: {
			span: {
				get: function(spanId) {
					return editor.find('#' + spanId);
				}
			},
			entity: {
				get: function(entityId) {
					return editor.find('#' + idFactory.makeEntityDomId(editor, entityId));
				}
			},
			grid: {
				get: function(spanId) {
					return editor.find('#G' + spanId);
				}
			},
		}
	};
};
